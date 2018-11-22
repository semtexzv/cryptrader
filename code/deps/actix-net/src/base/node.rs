use ::prelude::*;
use std::sync::Arc;

use tzmq::{
    self,
    async_types::{MultipartSink, MultipartStream, MultipartSinkStream},
};

use futures::sync::oneshot;
use futures::sync::mpsc::{
    UnboundedSender, UnboundedReceiver,
};
use futures::sync::mpsc::unbounded;


use super::{
    msg::*,
    comm::{
        HEARTBEAT_INTERVAL,
        BaseCommunicator,
        MsgType,
    },
    recipient::{
        RemoteRecipient,RemoteRequest
    }
};

/// Struct that holds outgoing connection to one separate node
/// It sends reqeuests, and receives responses over this connection,
pub(crate) struct BaseNode {
    comm: Addr<BaseCommunicator>,
    self_ident: Uuid,
    msg_id: u64,
    dealer_sink: UnboundedSender<Multipart>,
    requests: HashMap<u64, oneshot::Sender<Result<Bytes, RemoteError>>>,
    hb: Instant,

    connected: Option<oneshot::Sender<NodeConnected>>,
}

impl BaseNode {
    pub(crate) fn new(comm: Addr<BaseCommunicator>, addr: &str, ident: Uuid) -> impl Future<Item=NodeConnected, Error=failure::Error> {
        let dealer = Dealer::builder(super::comm::ZMQ_CTXT.clone())
            .identity(ident.as_bytes())
            .connect(addr)
            .build().unwrap();

        let (sink, stream) = dealer.sink_stream().split();

        let stream = stream.map_err(Into::<failure::Error>::into);
        let (tx, rx) = unbounded();

        let forwarder = sink.send_all(rx.map_err(|_| { tzmq::Error::Sink })).map(|_| ());

        let (conn_tx, conn_rx) = oneshot::channel();

        Actor::create(move |ctx| {
            ctx.spawn(wrap_future(forwarder).drop_err());
            Self::add_stream(stream, ctx);

            let hello = MessageWrapper::Hello.to_multipart().unwrap();
            tx.unbounded_send(hello).unwrap();

            ctx.run_interval(HEARTBEAT_INTERVAL, |this, _ctx| {
                let msg = MessageWrapper::Heartbeat;
                let msg = msg.to_multipart().unwrap();
                this.dealer_sink.unbounded_send(msg).unwrap();
            });

            BaseNode {
                self_ident: ident,
                msg_id: 0,
                comm,
                dealer_sink: tx,
                requests: HashMap::new(),
                hb: Instant::now(),
                connected: Some(conn_tx),
            }
        });

        conn_rx.map_err(Into::into)
    }

    pub(crate) fn resolve_request(&mut self, rid: u64, res: Result<Bytes, RemoteError>) {
        if let Some(sender) = self.requests.remove(&rid) {
            sender.send(res).unwrap()
        }
    }
}

impl fmt::Debug for BaseNode {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        f.debug_struct("NodeWorker").finish()
    }
}

impl Actor for BaseNode {
    type Context = Context<Self>;
}

impl StreamHandler<Multipart, failure::Error> for BaseNode {
    fn handle(&mut self, item: Multipart, _ctx: &mut Self::Context) {
        let msg = MessageWrapper::from_multipart(item).unwrap();
        println!("Message: {:?}", msg);
        match msg {
            MessageWrapper::Identify(uuid) => {
                if let Some(sender) = self.connected.take() {
                    sender.send(NodeConnected {
                        addr: _ctx.address(),
                        remote_id: uuid,
                    }).unwrap();
                }
            }
            MessageWrapper::Heartbeat => {
                self.hb = Instant::now();
            }
            MessageWrapper::Response(msgid, data) => {
                self.resolve_request(msgid, data);
            }
            x => {
                panic!("Unhandled message type : {:?} ", x);
            }
        }
    }
}

impl<M> Handler<SendRemoteRequest<M>> for BaseNode
    where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
          M::Result: Send + Serialize + DeserializeOwned + 'static
{
    type Result = Response<M::Result, RemoteError>;

    fn handle(&mut self, msg: SendRemoteRequest<M>, ctx: &mut Self::Context) -> Self::Result {
        self.msg_id += 1;
        let req_id = self.msg_id;

        let encoded = M::to_bytes(&msg.0).unwrap();

        let wrapped = MessageWrapper::Request(M::type_id().into(), self.msg_id, Bytes::from(encoded));
        let multipart = wrapped.to_multipart().unwrap();

        let (tx, rx) = oneshot::channel::<Result<Bytes, RemoteError>>();
        self.requests.insert(req_id, tx);

        let sent = wrap_future(self.dealer_sink.clone().send(multipart));
        let resolved = sent.then(move |res: Result<_, _>, this: &mut Self, _ctx: &mut Self::Context| {
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

        return Response::r#async(flat);
    }
}
