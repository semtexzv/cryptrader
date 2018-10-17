use ::prelude::*;

use std::collections::HashMap;
use msgs::RemoteMessage;
use tzmq::{
    self,
    Multipart,
    async_types::{
        MultipartSink,
        MultipartStream,
        MultipartSinkStream,
    },
};
use futures::sync::oneshot;
use common::bytes::Bytes;

use msgs::*;
use node::{NodeWorker, Node};
use futures::{
    sync::oneshot::Sender,
    sync::mpsc::{
        UnboundedSender,
        UnboundedReceiver,
        unbounded,
    },
};
use recipient::{
    RemoteMessageHandler, LocalRecipientHandler,
};
use std::time::Duration;

lazy_static! {
    pub static ref ZMQ_CTXT  : Arc<zmq::Context> = Arc::new(zmq::Context::new());
}
pub const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(10);

pub type NodeIdentity = Vec<u8>;
pub type MessageIdentity = Cow<'static, str>;
type IdentifiedMessage = (NodeIdentity, MessageWrapper);


pub struct CommWorker {
    /// Sink that will accept all data from this CommWorker, mainly replies to requests
    /// received on corresponding Stream, and Heartbeat messages
    router_sink: UnboundedSender<Multipart>,
    /// Registry of Handlers for each message type
    registry: HashMap<MessageIdentity, Box<RemoteMessageHandler>>,
    /// Nodes to which we are connected
    node_workers: HashMap<String, Addr<NodeWorker>>,
    /// Nodes that are connected to us
    remote_nodes: HashMap<NodeIdentity, Instant>,
}

impl fmt::Debug for CommWorker {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        f.debug_struct("CommWorker").finish()
    }
}

impl Actor for CommWorker {
    type Context = Context<Self>;
}


impl CommWorker {
    fn create(addr: &str) -> Result<Addr<Self>, failure::Error> {
        let router = Router::builder(ZMQ_CTXT.clone())
            .bind(&addr)
            .build()?;


        let (sink, stream) = router.sink_stream().split();

        let stream = stream.map_err(Into::<failure::Error>::into);

        let (tx, rx) = unbounded();

        let forwarder = sink.send_all(rx.map_err(|e| tzmq::Error::Sink)).map(|_| {});

        Ok(Arbiter::start(|ctx: &mut Context<CommWorker>| {
            ctx.spawn(wrap_future(forwarder).drop_err());
            Self::add_stream(stream, ctx);

            CommWorker {
                registry: HashMap::new(),
                router_sink: tx,
                node_workers: HashMap::new(),
                remote_nodes: HashMap::new(),
            }
        }))
    }

    pub(crate) fn caps(&mut self) -> HashSet<MessageIdentity> {
        self.registry.keys().map(|v| v.clone()).collect()
    }

    pub(crate) fn update_caps(&mut self, node: &NodeIdentity, _ctx: &mut Context<Self>) {
        let mut msg = MessageWrapper::Capabilities(self.caps());

        let mut msg = msg.to_multipart().unwrap();
        msg.push_front(zmq::Message::from_slice(node));

        self.router_sink.unbounded_send(msg);
    }

    pub(crate) fn update_all_caps(&mut self, _ctx: &mut Context<Self>) {
        let mut msg = MessageWrapper::Capabilities(self.caps());
        let mut now = Instant::now();

        //self.remote_nodes.retain(|n, hb| now.duration_since(*hb) < HEARTBEAT_INTERVAL * 2);
        for (node, hb) in self.remote_nodes.iter() {
            let mut msg = msg.to_multipart().unwrap();
            msg.push_front(zmq::Message::from_slice(&node));

            self.router_sink.unbounded_send(msg);
        }
    }
}

impl StreamHandler<(NodeIdentity, MessageWrapper), failure::Error> for CommWorker {
    fn handle(&mut self, (node_identity, data): (NodeIdentity, MessageWrapper), ctx: &mut Self::Context) {
        match data {
            MessageWrapper::Hello => {
                self.remote_nodes.insert(node_identity.clone(), Instant::now());
                self.update_caps(&node_identity, ctx);
            }
            // Reaction to heartbeat is simple, send it back.
            MessageWrapper::Heartbeat => {
                self.remote_nodes.insert(node_identity.clone(), Instant::now());
                let resp = MessageWrapper::Heartbeat;

                let mut multipart = resp.to_multipart().unwrap();
                multipart.push_front(zmq::Message::from_slice(&node_identity));


                let f = self.router_sink.clone()
                    .send(multipart)
                    .then(|_| fut::ok::<_, ()>(()));

                ctx.spawn(wrap_future(f));
            }

            MessageWrapper::Request(type_id, msgid, data) => {
                match self.registry.get(type_id.deref()) {
                    Some(handler) => {
                        let (tx, rx) = oneshot::channel();

                        handler.handle(data, tx);

                        let rx = rx.map_err(|_| RemoteError::MailboxClosed).flatten();
                        let wrapped = wrap_future(rx);

                        let wrapped = wrapped.then(move |res, this: &mut CommWorker, ctx| {
                            let msg = MessageWrapper::Response(msgid, res);
                            let mut multipart = msg.to_multipart().unwrap();

                            multipart.push_front(zmq::Message::from_slice(&node_identity));

                            let f = this.router_sink.clone()
                                .send(multipart)
                                .then(|_| fut::ok::<_, ()>(()));

                            return wrap_future(f);
                        });
                        ctx.spawn(wrapped.drop_err());
                    }
                    None => {
                        println!("No handler found");

                        let resp = MessageWrapper::Response(msgid, Err(RemoteError::HandlerNotFound));

                        let mut multipart = resp.to_multipart().unwrap();
                        multipart.push_front(zmq::Message::from_slice(&node_identity));

                        let f = self.router_sink.clone()
                            .send(multipart)
                            .then(|_| fut::ok::<_, ()>(()));

                        ctx.spawn(wrap_future(f));
                    }
                }
            }

            x => {
                panic!("Unhandled message in communicator : {:?}", x);
            }
        }
    }
}

impl StreamHandler<Multipart, failure::Error> for CommWorker {
    fn handle(&mut self, mut item: Multipart, ctx: &mut Self::Context) {
        let identity = item.pop_front().unwrap().to_vec();
        let data: MessageWrapper = json::from_slice(&item.pop_front().unwrap()).unwrap();

        <Self as StreamHandler<IdentifiedMessage, _>>::handle(self, (identity, data), ctx);
    }
}


impl Handler<ConnectToNode> for CommWorker {
    type Result = Result<Addr<NodeWorker>, failure::Error>;

    fn handle(&mut self, msg: ConnectToNode, ctx: &mut Self::Context) -> <Self as Handler<ConnectToNode>>::Result {
        use std::collections::hash_map::{Entry, OccupiedEntry, VacantEntry};
        let entry = self.node_workers.entry(msg.node_addr.clone());

        return Ok(entry.or_insert_with(|| {
            let addr = NodeWorker::new(ctx.address(), &msg.node_addr, &msg.node_addr).unwrap();

            addr
        }).clone());
    }
}

impl<M> Handler<RegisterLocalHandler<M>> for CommWorker
    where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static + Debug,
          M::Result: Send + Serialize + DeserializeOwned + 'static

{
    type Result = ();

    fn handle(&mut self, reg_msg: RegisterLocalHandler<M>, ctx: &mut Self::Context) {
        self.registry.insert(M::type_id(), Box::new(LocalRecipientHandler::new(reg_msg.recipient)));
        self.update_all_caps(ctx);
    }
}


#[derive(Debug, Clone)]
pub struct Communicator {
    pub(crate) addr: Addr<CommWorker>,
}

impl Communicator {
    pub fn create(addr: &str) -> Result<Self, failure::Error> {
        let addr = CommWorker::create(addr)?;
        Ok(Communicator {
            addr
        })
    }

    pub fn connect_async(&self, node_addr: &str) -> impl Future<Item=Node, Error=failure::Error> {
        let msg = ConnectToNode {
            node_addr: node_addr.to_string()
        };
        self.addr.send(msg).flatten().map(Node::from_inner)
    }

    pub fn connect(&self, node_addr: &str) -> Result<Node, failure::Error> {
        // The waiting here should not pose a problem, Worker is in separate thread
        self.connect_async(node_addr).wait()
    }

    pub fn register<M>(&self, rec: Recipient<M>)
        where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static + Debug,
              M::Result: Send + Send + Serialize + DeserializeOwned + 'static
    {
        self.addr.do_send(RegisterLocalHandler {
            recipient: rec,
        });
    }
}