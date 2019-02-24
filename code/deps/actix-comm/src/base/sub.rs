use crate::prelude::*;
use crate::msg::*;
use crate::ctx::ContextHandle;
use futures_util::FutureExt;
use crate::util::*;



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
        let tag = item.pop_front().unwrap().to_vec();
        let data: MessageWrapper = json::from_slice(&item.pop_front().unwrap()).unwrap();

        self.handle_message(ctx, vec![], data);
    }
}

impl Subscribe {
    pub fn bind(handle: ContextHandle, addr: &str) -> impl Future<Item=Addr<Self>, Error=tzmq::Error> {
        let socket = tzmq::Sub::builder(handle.zmq_ctx.clone())
            .identity(handle.uuid.as_bytes())
            .customize(|sock : &zmq::Socket| {
                set_keepalives(sock);
            })
            .bind(addr)
            .filter(b"")
            .build();

        return Self::create(handle, box socket);
    }

    pub fn connect(handle: ContextHandle, addr: &str) -> impl Future<Item=Addr<Self>, Error=tzmq::Error> {
        let socket = tzmq::Sub::builder(handle.zmq_ctx.clone())
            .identity(handle.uuid.as_bytes())
            .customize(|sock : &zmq::Socket| {
                set_keepalives(sock);
            })
            .connect(addr)
            .filter(b"")
            .build();
        return Self::create(handle, box socket);
    }


    fn create(handle: ContextHandle, socket: BoxFuture<Sub, tzmq::Error>) -> impl Future<Item=Addr<Self>, Error=tzmq::Error> {
        socket.map(|socket: Sub| {
            Actor::create(|ctx| {
                let stream = socket.stream();

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
                    let rx = rx.map_err(|_| RemoteError::MailboxClosed).flatten();
                    let wrapped = wrap_future(rx.unwrap_err().set_err(()));
                    ctx.spawn(wrapped.drop_err().map(|_, _, _| ()));
                }
            }
            a => {
                panic!("Message {:?} not implemented", a)
            }
        }
    }
}