use crate::prelude::*;
use crate::msg::*;
use crate::ctx::ContextHandle;
use futures_util::FutureExt as FExt;
use tokio::util::FutureExt;
use futures::sync::mpsc::UnboundedSender;
use crate::util::*;

pub type ResponeSender = OneSender<Result<WrappedType, RemoteError>>;


pub struct Request {
    handle: crate::ctx::ContextHandle,
    streams: [SpawnHandle; 2],
    sender: UnboundedSender<Multipart>,
    requests: HashMap<u64, ResponeSender>,
    last_req: Instant,
    last_resp: Instant,
    msgid: u64,
}

impl Actor for Request { type Context = Context<Self>; }

impl<M> Handler<SendRequest<M>> for Request
    where M: RemoteMessage + Remotable,
          M::Result: Remotable
{
    type Result = Response<M::Result, RemoteError>;

    fn handle(&mut self, msg: SendRequest<M>, ctx: &mut Self::Context) -> Self::Result {
        self.last_req = Instant::now();
        self.msgid += 1;
        let msgid = self.msgid;

        let encoded = M::to_wrapped(&msg.0).unwrap();

        let wrapped = MessageWrapper::Request(M::type_id().into(), msgid, encoded);
        let multipart = wrapped.to_multipart().unwrap();

        let (tx, rx) = oneshot::<Result<WrappedType, RemoteError>>();

        self.requests.insert(msgid, tx);

        let sent = wrap_future(self.sender.clone().send(multipart));
        let resolved = sent.then(move |res: Result<_, _>, this: &mut Self, _ctx: &mut Self::Context| {
            res.unwrap();
            afut::ok(())
        });
        ctx.spawn(resolved);

        let flat = rx
            // Inner error is cancelled, that means the request processor was dropped
            .map_err(|_| RemoteError::MailboxClosed)
            // Safety timeout
            .timeout(Duration::from_secs(60))
            // We return Inner error or timeout error manually
            .map_err(|e| e.into_inner().unwrap_or(RemoteError::Timeout))
            // We flatten error resulting from timeout, on top of mailbox closed error
            .flatten();

        let flat = flat.map(|v| M::res_from_wrapped(&v).unwrap());

        return Response::r#async(flat);
    }
}

impl StreamHandler<Multipart, tzmq::Error> for Request {
    fn handle(&mut self, mut item: Multipart, ctx: &mut Self::Context) {
        self.last_resp = Instant::now();
        let data: MessageWrapper = json::from_slice(&item.pop_front().unwrap()).unwrap();

        self.handle_message(ctx, data);
    }
}

impl Request {
    pub fn new(handle: ContextHandle, addr: &str) -> impl Future<Item=Addr<Self>, Error=tzmq::Error> {
        let socket = Self::create_socket(handle.clone(), addr);
        let addr = addr.to_string();

        socket.map(|socket| {
            Actor::create(|ctx| {
                let (tx, streams) = Self::init_streams(ctx, socket);

                let hello = MessageWrapper::Hello.to_multipart().unwrap();
                tx.unbounded_send(hello).unwrap();

                ctx.run_interval(Duration::from_secs(10), move |this, ctx| {
                    // Rust panics on negativbe durations
                    if this.last_req > this.last_resp &&  this.last_req.duration_since(this.last_resp) > Duration::from_secs(15) {
                        this.reconnect(ctx, &addr)
                    }
                });

                Request {
                    handle,
                    streams,
                    requests: Default::default(),
                    sender: tx,
                    last_resp: Instant::now(),
                    last_req: Instant::now(),
                    msgid: 0,
                }
            })
        })
    }

    pub(crate) fn create_socket(handle: ContextHandle, addr: &str) -> impl Future<Item=Dealer, Error=tzmq::Error> {
        tzmq::Dealer::builder(handle.zmq_ctx.clone())
            .identity(handle.uuid.as_bytes())
            .customize(|sock: &zmq::Socket| {
                set_keepalives(sock);
            })
            .connect(addr)
            .build()
    }

    pub(crate) fn reconnect(&mut self, ctx: &mut Context<Self>, addr: &str) {
        info!("Reconnecting");
        let socket = wrap_future(Self::create_socket(self.handle.clone(), addr));
        let reconn = socket.map(|socket, this: &mut Self, ctx| {
            let (tx, handles) = Self::init_streams(ctx, socket);
            let old = std::mem::replace(&mut this.streams, handles);
            this.sender = tx;
            ctx.cancel_future(old[0]);
            ctx.cancel_future(old[1]);
            ()
        }).drop_err();
        ctx.spawn(reconn);
    }

    pub(crate) fn init_streams(ctx: &mut Context<Self>, dealer: tzmq::Dealer) -> (UnboundedSender<Multipart>, [SpawnHandle; 2]) {
        let (sink, stream) = dealer.sink_stream(25).split();
        let (tx, rx) = futures::sync::mpsc::unbounded();
        let forward = sink.send_all(rx.map_err(|_| tzmq::Error::Sink));

        let a = ctx.spawn(wrap_future(forward.drop_item().drop_err()));
        let b = Self::add_stream(stream, ctx);

        (tx, [a, b])
    }

    pub(crate) fn resolve_request(&mut self, rid: u64, res: Result<WrappedType, RemoteError>) {
        if let Some(sender) = self.requests.remove(&rid) {
            if let Err(e) = sender.send(res) {
                error!("Receiver dropped for {:?}", rid);
            }
        } else {
            error!("Request {:?} was already resolved", rid)
        }
    }

    fn handle_message(&mut self, ctx: &mut Context<Self>, msg: MessageWrapper) {
        match msg {
            MessageWrapper::Response(id, data) => {
                self.resolve_request(id, data);
            }
            a => {
                panic!("Message {:?} not implemented", a)
            }
        }
    }
}