use ::prelude::*;

use std::collections::HashMap;
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

use futures::{
    sync::oneshot::Sender,
    sync::mpsc::{
        UnboundedSender,
        UnboundedReceiver,
        unbounded,
    },
};

use super::{
    msg::*,
    node::{
        BaseNode,
    },
    recipient::{
        RemoteMessageHandler, LocalRecipientHandler,
    },
};

lazy_static! {
    pub(crate) static ref ZMQ_CTXT  : Arc<zmq::Context> = Arc::new(zmq::Context::new());
}

pub(crate) const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(10);

pub type NodeIdentity = Vec<u8>;
pub type MsgType = Cow<'static, str>;
type IdentifiedMessage = (NodeIdentity, MessageWrapper);


pub(crate) struct NodeInfo {
    addr: Addr<BaseNode>,
    id: Uuid,
    last_hb: Instant,
}

impl NodeInfo {
    fn new(addr: Addr<BaseNode>, id: Uuid) -> Self {
        NodeInfo {
            addr,
            id,
            last_hb: Instant::now(),
        }
    }
}

pub(crate) struct BaseCommunicator {
    pub(crate) uuid: Uuid,
    /// Sink that will accept all data from this CommWorker, mainly replies to requests
    /// received on corresponding Stream, and Heartbeat messages
    router_sink: UnboundedSender<Multipart>,

    registry: HashMap<MsgType, Box<RemoteMessageHandler>>,

    nodes: HashMap<Uuid, NodeInfo>,

    node_names: HashMap<String, Uuid>,
}

impl fmt::Debug for BaseCommunicator {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        f.debug_struct("BaseCommunicator").finish()
    }
}

impl Actor for BaseCommunicator {
    type Context = Context<Self>;
}


impl BaseCommunicator {
    pub fn new(addr: &str) -> Result<Addr<Self>, failure::Error> {
        let uuid = Uuid::new_v4();
        let router = Router::builder(ZMQ_CTXT.clone())
            .identity(uuid.as_bytes())
            .bind(&addr)
            .build()?;

        let (sink, stream) = router.sink_stream().split();

        let stream = stream.map_err(Into::<failure::Error>::into);

        let (tx, rx) = unbounded();

        let forwarder = sink.send_all(rx.map_err(|_| tzmq::Error::Sink)).map(|_| {});

        Ok(Arbiter::start(move |ctx: &mut Context<BaseCommunicator>| {
            ctx.spawn(wrap_future(forwarder).drop_err());
            Self::add_stream(stream, ctx);

            BaseCommunicator {
                uuid,
                registry: HashMap::new(),
                router_sink: tx,
                nodes: HashMap::new(),
                node_names: HashMap::new(),
            }
        }))
    }
}

impl StreamHandler<(NodeIdentity, MessageWrapper), failure::Error> for BaseCommunicator {
    fn handle(&mut self, (node_identity, data): (NodeIdentity, MessageWrapper), ctx: &mut Self::Context) {
        let id = Uuid::from_slice(&node_identity).unwrap();

        match data {
            MessageWrapper::Hello => {
                let mut resp = MessageWrapper::Identify(self.uuid).to_multipart().unwrap();
                resp.push_front(zmq::Message::from_slice(&node_identity));
                self.router_sink.unbounded_send(resp).unwrap();
            }

            // Reaction to heartbeat is simple, send it back.
            MessageWrapper::Heartbeat => {
                if let Some(ref mut node) = self.nodes.get_mut(&id) {
                    node.last_hb = Instant::now();
                }

                let resp = MessageWrapper::Heartbeat;

                let mut multipart = resp.to_multipart().unwrap();
                multipart.push_front(zmq::Message::from_slice(&node_identity));

                self.router_sink.unbounded_send(multipart).unwrap();
            }

            MessageWrapper::Request(type_id, msgid, data) => {
                match self.registry.get(type_id.deref()) {
                    Some(handler) => {
                        let (tx, rx) = oneshot::channel();

                        handler.handle(data, tx);

                        let rx = rx.map_err(|_| RemoteError::MailboxClosed).flatten();
                        let wrapped = wrap_future(rx);

                        let wrapped = wrapped.then(move |res, this: &mut BaseCommunicator, _ctx| {
                            let msg = MessageWrapper::Response(msgid, res);
                            let mut multipart = msg.to_multipart().unwrap();

                            multipart.push_front(zmq::Message::from_slice(&node_identity));

                            let f = this.router_sink.clone()
                                .send(multipart)
                                .then(|_| future::ok::<_, ()>(()));

                            return wrap_future(f);
                        });
                        ctx.spawn(wrapped.drop_err());
                    }
                    None => {
                        println!("No handler found for msg type : {:?}", type_id);

                        let resp = MessageWrapper::Response(msgid, Err(RemoteError::HandlerNotFound));

                        let mut multipart = resp.to_multipart().unwrap();
                        multipart.push_front(zmq::Message::from_slice(&node_identity));

                        let f = self.router_sink.clone()
                            .send(multipart)
                            .then(|_| future::ok::<_, ()>(()));

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

impl StreamHandler<Multipart, failure::Error> for BaseCommunicator {
    fn handle(&mut self, mut item: Multipart, ctx: &mut Self::Context) {
        let identity = item.pop_front().unwrap().to_vec();
        let data: MessageWrapper = json::from_slice(&item.pop_front().unwrap()).unwrap();

        <Self as StreamHandler<IdentifiedMessage, _>>::handle(self, (identity, data), ctx);
    }
}

impl Handler<ConnectToNode> for BaseCommunicator {
    type Result = ResponseActFuture<BaseCommunicator, Addr<BaseNode>, failure::Error>;

    fn handle(&mut self, msg: ConnectToNode, ctx: &mut Self::Context) -> Self::Result {
        use std::collections::hash_map::{Entry, OccupiedEntry, VacantEntry};
        let self_id = self.uuid.clone();

        let f = wrap_future(BaseNode::new(ctx.address(), &msg.node_addr, self_id).map_err(Into::into));
        return box f.map(|it: NodeConnected, this: &mut Self, ctx| {
            // Enter node record into local cache
            this.node_names.insert(msg.node_addr, it.remote_id.clone());
            this.nodes.insert(it.remote_id.clone(), NodeInfo::new(it.addr.clone(), it.remote_id));
            it.addr
        });
    }
}

impl<M> Handler<RegisterRecipientHandler<M>> for BaseCommunicator
    where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
          M::Result: Send + Serialize + DeserializeOwned + 'static

{
    type Result = ();

    fn handle(&mut self, reg_msg: RegisterRecipientHandler<M>, ctx: &mut Self::Context) {
        self.registry.insert(M::type_id(), Box::new(LocalRecipientHandler::new(reg_msg.recipient)));
    }
}

impl<M> Handler<DispatchRemoteRequest<M>> for BaseCommunicator
    where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
          M::Result: Send + Serialize + DeserializeOwned + 'static
{
    type Result = Response<M::Result, RemoteError>;

    fn handle(&mut self, DispatchRemoteRequest { req, node_id }: DispatchRemoteRequest<M>, ctx: &mut Self::Context) -> Self::Result {
        if let Some(n) = self.nodes.get(&node_id) {
            let sent = n.addr.send(req).map_err(|_| RemoteError::HandlerNotFound).flatten();
            return Response::r#async(sent);
        } else {
            return Response::reply(Err(RemoteError::NodeNotFound));
        }
    }
}

