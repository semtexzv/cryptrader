use ::prelude::*;
use super::msgs::*;
use std::sync::Arc;

use tzmq::{
    self,
    async_types::{MultipartSink, MultipartStream, MultipartSinkStream},
};


use futures::sync::oneshot;
use futures::sync::mpsc::UnboundedSender;
use futures::sync::mpsc::unbounded;


use comm::{
    HEARTBEAT_INTERVAL,
    CommWorker, Communicator,
};
use recipient::RemoteRequest;
use comm::MessageIdentity;

/// Struct that holds outgoing connection to one separate node
/// It sends reqeuests, and receives responses over this connection,
pub(crate) struct NodeWorker {
    msg_id: u64,
    comm: Addr<CommWorker>,
    dealer_sink: UnboundedSender<Multipart>,
    requests: HashMap<u64, oneshot::Sender<Result<Bytes, RemoteError>>>,
    capabilities: HashSet<MessageIdentity>,
    hb: Instant,
}

impl NodeWorker {
    pub(crate) fn new(comm: Addr<CommWorker>, node_addr: &str, token: &str) -> Result<Addr<Self>, failure::Error> {
        let dealer = Dealer::builder(::comm::ZMQ_CTXT.clone())
            .connect(node_addr)
            .build()?;

        let (sink, stream) = dealer.sink_stream().split();

        let stream = stream.map_err(Into::<failure::Error>::into);
        let (tx, rx) = unbounded();

        let forwarder = sink.send_all(rx.map_err(|e| {
            tzmq::Error::Sink
        })).map(|_| ());

        let mut token = token.to_string();
        Ok(Actor::create(move |ctx| {
            ctx.spawn(wrap_future(forwarder).drop_err());
            Self::add_stream(stream, ctx);

            let mut hello = MessageWrapper::Hello.to_multipart().unwrap();
            tx.unbounded_send(hello).unwrap();

            ctx.run_interval(HEARTBEAT_INTERVAL, |this, ctx| {
                let mut msg = MessageWrapper::Heartbeat;
                let msg = msg.to_multipart().unwrap();
                this.dealer_sink.unbounded_send(msg).unwrap();
            });

            NodeWorker {
                msg_id: 0,
                comm,
                dealer_sink: tx,
                requests: HashMap::new(),
                hb: Instant::now(),
                capabilities: HashSet::new(),
            }
        }))
    }

    pub(crate) fn send(&mut self, mp : Multipart, ctx: &mut Context<Self>) {

    }
    pub(crate) fn resolve_request(&mut self, rid: u64, res: Result<Bytes, RemoteError>) {
        if let Some(sender) = self.requests.remove(&rid) {
            sender.send(res);
        }
    }
}

impl fmt::Debug for NodeWorker {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        f.debug_struct("NodeWorker").finish()
    }
}

impl Actor for NodeWorker {
    type Context = Context<Self>;
}

impl StreamHandler<Multipart, failure::Error> for NodeWorker {
    fn handle(&mut self, item: Multipart, ctx: &mut Self::Context) {
        let mut msg = MessageWrapper::from_multipart(item).unwrap();
        println!("Message: {:?}", msg);
        match msg {
            MessageWrapper::Heartbeat => {
                self.hb = Instant::now();
            }
            MessageWrapper::Response(msgid, data) => {
                self.resolve_request(msgid, data);
            }
            MessageWrapper::Capabilities(caps) => {
                self.capabilities = caps;
            }
            x => {
                panic!("Unhandled message type : {:?} ", x);
            }
        }
    }
}

impl<M> Handler<SendRemoteRequest<M>> for NodeWorker
    where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
          M::Result: Send + Serialize + DeserializeOwned + 'static
{
    type Result = Response<M::Result, RemoteError>;

    fn handle(&mut self, msg: SendRemoteRequest<M>, ctx: &mut Self::Context) -> Self::Result {
        self.msg_id += 1;
        let req_id = self.msg_id;

        let mut encoded = M::to_bytes(&msg.0).unwrap();

        let mut wrapped = MessageWrapper::Request(M::type_id().into(), self.msg_id, Bytes::from(encoded));
        let multipart = wrapped.to_multipart().unwrap();

        let (tx, rx) = oneshot::channel::<Result<Bytes, RemoteError>>();
        self.requests.insert(req_id, tx);

        let sent = wrap_future(self.dealer_sink.clone().send(multipart));
        let resolved = sent.then(move |res: Result<_, _>, this: &mut Self, ctx: &mut Self::Context| {
            match res {
                Ok(_) => (),
                Err(_) => {
                    this.resolve_request(req_id, Err(RemoteError::MailboxClosed));
                }
            }
            afut::ok(())
        });
        // Spawn created future on local context, this future will try to send data over the network to
        // remote communicator node, and if it fails to do so, will resolve `rx` to error.
        ctx.spawn(resolved);


        let flat = rx.map_err(|_| MailboxError::Closed).flatten();
        let flat = flat.map(|v| M::res_from_bytes(&v).unwrap());

        return Response::async(flat);
    }
}

#[derive(Debug, Clone)]
pub struct Node {
    pub(crate) addr: Addr<NodeWorker>
}

impl Node {
    pub(crate) fn from_inner(addr: Addr<NodeWorker>) -> Self {
        Node {
            addr
        }
    }

    pub fn send<M>(&self, msg: M) -> RemoteRequest<M>
        where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static + Debug,
              M::Result: Send + Serialize + DeserializeOwned + 'static + Debug
    {
        RemoteRequest::new(self.addr.send(SendRemoteRequest(msg)))
    }

    pub fn do_send<M>(&self, msg: M)
        where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static + Debug,
              M::Result: Send + Serialize + DeserializeOwned + 'static + Debug
    {
        self.addr.do_send(SendRemoteRequest(msg))
    }

    pub fn try_send<M>(&self, msg: M) -> Result<(), SendError<M>>
        where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static + Debug,
              M::Result: Send + Serialize + DeserializeOwned + 'static + Debug
    {
        self.addr.try_send(SendRemoteRequest(msg))
            .map_err(|e| {
                match e {
                    SendError::Closed(e) => SendError::Closed(e.0),
                    SendError::Full(e) => SendError::Full(e.0),
                }
            })
    }
}