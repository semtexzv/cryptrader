use crate::prelude::*;
use crate::msg::*;
use crate::ctx::ContextHandle;
use futures_util::FutureExt;


pub struct Subscribe {
    handle: crate::ctx::ContextHandle,
    registry: crate::util::HandlerRegistry,
}

impl Actor for Subscribe { type Context = Context<Self>; }

impl<M> Handler<RegisterHandler<M>> for Subscribe
    where M: RemoteMessage + Remotable,
          M::Result: Remotable
{
    type Result = ();

    fn handle(&mut self, msg: RegisterHandler<M>, ctx: &mut Self::Context) -> Self::Result {
        self.registry.register(M::type_id(), box crate::util::RecipientHandler(msg.0));
    }
}

impl Handler<RegisterDefaultHandler> for Subscribe {
    type Result = ();

    fn handle(&mut self, msg: RegisterDefaultHandler, ctx: &mut Self::Context) -> Self::Result {
        self.registry.set_default(box crate::util::DefaultHandler(msg.0));
    }
}


impl StreamHandler<Multipart, tzmq::Error> for Subscribe {
    fn handle(&mut self, mut item: Multipart, ctx: &mut Self::Context) {
        let identity = item.pop_front().unwrap().to_vec();
        let data: MessageWrapper = json::from_slice(&item.pop_front().unwrap()).unwrap();

        self.handle_message(ctx, identity, data);
    }
}

impl Subscribe {
    fn new_on(handle: ContextHandle, addr: &str) -> impl Future<Item=Addr<Self>, Error=tzmq::Error> {
        let socket = tzmq::Sub::builder(handle.zmq_ctx.clone())
            .identity(handle.uuid.as_bytes())
            .bind(addr)
            .build();
        return Self::create(handle, socket);
    }

    fn new_to(handle: ContextHandle, addr: &str) -> impl Future<Item=Addr<Self>, Error=tzmq::Error> {
        let socket = tzmq::Sub::builder(handle.zmq_ctx.clone())
            .identity(handle.uuid.as_bytes())
            .connect(addr)
            .build();
        return Self::create(handle, socket);
    }


    fn create(handle: ContextHandle, socket: impl Future<Item=Sub, Error=tzmq::Error>) -> impl Future<Item=Addr<Self>, Error=tzmq::Error> {
        socket.map(|router| {
            Actor::create(|ctx| {
                let stream = router.stream();

                Self::add_stream(stream, ctx);
                Subscribe {
                    handle,
                    registry: Default::default(),
                }
            })
        })
    }

    fn handle_message(&mut self, ctx: &mut Context<Self>, identity: Identity, msg: MessageWrapper) {
        match msg {
            MessageWrapper::Announcement(typ, data) => {
                if let Some(handler) = self.registry.get(&typ) {
                    let (tx, rx) = oneshot();
                    handler.handle(typ, data, tx);
                }
            }
            a => {
                panic!("Message {:?} not implemented", a)
            }
        }
    }
}