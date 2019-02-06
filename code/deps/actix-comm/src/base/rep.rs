use crate::prelude::*;
use crate::msg::*;
use crate::ctx::ContextHandle;
use futures_util::FutureExt;


pub struct Reply {
    handle: crate::ctx::ContextHandle,
    registry: crate::util::HandlerRegistry,
    sender: Sender<Multipart>,
}

impl Actor for Reply {
    type Context = Context<Self>;
}

impl<M> Handler<RegisterHandler<M>> for Reply
    where M: RemoteMessage + Remotable,
          M::Result: Remotable
{
    type Result = ();

    fn handle(&mut self, msg: RegisterHandler<M>, ctx: &mut Self::Context) -> Self::Result {
        self.registry.register(M::type_id(), box crate::util::RecipientHandler(msg.0));
    }
}

impl Handler<RegisterDefaultHandler> for Reply {
    type Result = ();

    fn handle(&mut self, msg: RegisterDefaultHandler, ctx: &mut Self::Context) -> Self::Result {
        self.registry.set_default(box crate::util::DefaultHandler(msg.0));
    }
}

impl StreamHandler<Multipart, tzmq::Error> for Reply {
    fn handle(&mut self, mut item: Multipart, ctx: &mut Self::Context) {
        let identity = item.pop_front().unwrap().to_vec();
        let data: MessageWrapper = json::from_slice(&item.pop_front().unwrap()).unwrap();

        self.handle_message(ctx, identity, data);
    }
}

impl Reply {
    fn new(handle: ContextHandle, addr: &str) -> impl Future<Item=Addr<Self>, Error=tzmq::Error> {
        let router = tzmq::Router::builder(handle.zmq_ctx.clone())
            .identity(handle.uuid.as_bytes())
            .bind(addr)
            .build();

        router.map(|router| {
            let (sink, stream) = router.sink_stream(25).split();
            let (tx, rx) = futures::sync::mpsc::channel(25);

            let forward = sink.send_all(rx.map_err(|_| tzmq::Error::Sink));

            Actor::create(|ctx| {
                ctx.spawn(wrap_future(forward.drop_item().drop_err()));
                Self::add_stream(stream, ctx);
                Reply {
                    handle,
                    registry: Default::default(),
                    sender: tx,
                }
            })
        })
    }

    fn handle_message(&mut self, ctx: &mut Context<Self>, identity: Identity, msg: MessageWrapper) {
        match msg {
            MessageWrapper::Request(typ, id, data) => {
                if let Some(handler) = self.registry.get(&typ) {
                    let (tx, rx) = oneshot();
                    handler.handle(typ, data, tx);
                    let rx = rx
                        .unwrap_err()
                        .set_err(RemoteError::MailboxClosed)
                        .flatten();

                    let rx = wrap_future(rx)
                        .then(move |res, this: &mut Self, ctx| {
                            let msg = MessageWrapper::Response(id, res);
                            let mut mp = msg.to_multipart().unwrap();
                            mp.push_front(zmq::Message::from_slice(&identity).unwrap());

                            let f = this.sender.clone()
                                .send(mp)
                                .then(|_| future::ok(()));
                            wrap_future(f)
                        });

                    ctx.spawn(rx);
                } else {
                    let resp = MessageWrapper::Response(id, Err(RemoteError::HandlerNotFound));

                    let mut multipart = resp.to_multipart().unwrap();
                    multipart.push_front(zmq::Message::from_slice(&identity).unwrap());

                    let f = self.sender.clone()
                        .send(multipart)
                        .then(|_| future::ok::<_, ()>(()));

                    ctx.spawn(wrap_future(f));
                }
            }
            a => {
                panic!("Message {:?} not implemented", a)
            }
        }
    }
}