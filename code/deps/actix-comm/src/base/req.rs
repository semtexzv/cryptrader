use crate::prelude::*;
use crate::msg::*;
use crate::ctx::ContextHandle;
use futures_util::FutureExt as FExt;
use tokio::util::FutureExt;
use futures::sync::mpsc::UnboundedSender;

pub type ResponeSender = OneSender<Result<WrappedType, RemoteError>>;

pub struct Request {
    handle: crate::ctx::ContextHandle,
    sender: UnboundedSender<Multipart>,
    requests: HashMap<u64, ResponeSender>,
    msgid: u64,
}

impl Actor for Request { type Context = Context<Self>; }

impl<M> Handler<SendRequest<M>> for Request
    where M: RemoteMessage + Remotable,
          M::Result: Remotable
{
    type Result = Response<M::Result, RemoteError>;

    fn handle(&mut self, msg: SendRequest<M>, ctx: &mut Self::Context) -> Self::Result {
        self.msgid += 1;
        let msgid = self.msgid;

        let encoded = M::to_wrapped(&msg.0).unwrap();

        let wrapped = MessageWrapper::Request(M::type_id().into(), msgid, encoded);
        let multipart = wrapped.to_multipart().unwrap();

        let (tx, rx) = oneshot::<Result<WrappedType, RemoteError>>();

        self.requests.insert(msgid, tx);

        let sent = wrap_future(self.sender.clone().send(multipart));
        let resolved = sent.then(move |res: Result<_, _>, this: &mut Self, _ctx: &mut Self::Context| {
            res.unwrap();/*
            match res {
                Ok(_) => (),
                Err(_) => {
                    this.resolve_request(msgid, Err(RemoteError::MailboxClosed));
                }
            }*/
            afut::ok(())
        });
        ctx.spawn(resolved);
        let flat = rx
            .map_err(|_| RemoteError::MailboxClosed)
            .timeout(Duration::from_secs(30))
            .map_err(|e| e.into_inner().unwrap_or(RemoteError::Timeout))
            .flatten();

        let flat = flat.map(|v| M::res_from_wrapped(&v).unwrap());

        return Response::r#async(flat);
    }
}

impl StreamHandler<Multipart, tzmq::Error> for Request {
    fn handle(&mut self, mut item: Multipart, ctx: &mut Self::Context) {
        let identity = item.pop_front().unwrap().to_vec();
        let data: MessageWrapper = json::from_slice(&item.pop_front().unwrap()).unwrap();

        self.handle_message(ctx, identity, data);
    }
}

impl Request {
    pub fn new(handle: ContextHandle, addr: &str) -> impl Future<Item=Addr<Self>, Error=tzmq::Error> {
        let router = tzmq::Dealer::builder(handle.zmq_ctx.clone())
            .identity(handle.uuid.as_bytes())
            .connect(addr)
            .build();

        future::result(router.map(|router| {
            let (sink, stream) = router.sink_stream().split();
            let (tx, rx) = futures::sync::mpsc::unbounded();

            let forward = sink.send_all(rx.map_err(|_| tzmq::Error::Sink));

            Actor::create(|ctx| {
                ctx.spawn(wrap_future(forward.drop_item().drop_err()));
                Self::add_stream(stream, ctx);

                let hello = MessageWrapper::Hello.to_multipart().unwrap();
                tx.unbounded_send(hello).unwrap();

                Request {
                    handle,
                    requests: Default::default(),
                    sender: tx,
                    msgid: 0,
                }
            })
        }))
    }

    pub(crate) fn resolve_request(&mut self, rid: u64, res: Result<WrappedType, RemoteError>) {
        if let Some(sender) = self.requests.remove(&rid) {
            // We ignore the result here

            let _ = sender.send(res);
        }
    }

    fn handle_message(&mut self, ctx: &mut Context<Self>, identity: Identity, msg: MessageWrapper) {
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