use crate::prelude::*;
use crate::msg::*;
use crate::ctx::ContextHandle;
use futures_util::FutureExt as FExt;
use tokio::util::FutureExt;

pub type ResponeSender = OneSender<Result<WrappedType, RemoteError>>;

pub struct Publish {
    handle: crate::ctx::ContextHandle,
    sender: Sender<Multipart>,
}

impl Actor for Publish { type Context = Context<Self>; }

impl<M> Handler<SendRequest<M>> for Publish
    where M: RemoteMessage<Result=()> + Remotable
{
    type Result = Result<(), RemoteError>;

    fn handle(&mut self, msg: SendRequest<M>, ctx: &mut Self::Context) -> Self::Result {
        let encoded = M::to_wrapped(&msg.0).unwrap();

        let wrapped = MessageWrapper::Announcement(M::type_id().into(), encoded);
        let multipart = wrapped.to_multipart().unwrap();

        let sent = wrap_future(self.sender.clone().send(multipart).unwrap_err().set_err(()).drop_item());

        ctx.spawn(sent);
        Ok(())
    }
}


impl Publish {
    fn new_on(handle: ContextHandle, addr: &str) -> impl Future<Item=Addr<Self>, Error=tzmq::Error> {
        let socket = tzmq::Pub::builder(handle.zmq_ctx.clone())
            .identity(handle.uuid.as_bytes())
            .bind(addr)
            .build();

        Self::create(handle, socket)
    }

    fn new_to(handle: ContextHandle, addr: &str) -> impl Future<Item=Addr<Self>, Error=tzmq::Error> {
        let socket = tzmq::Pub::builder(handle.zmq_ctx.clone())
            .identity(handle.uuid.as_bytes())
            .connect(addr)
            .build();

        Self::create(handle, socket)
    }

    fn create(handle: ContextHandle, socket: impl Future<Item=Pub, Error=tzmq::Error>) -> impl Future<Item=Addr<Self>, Error=tzmq::Error> {
        socket.map(|socket| {
            let sink = socket.sink(25);
            let (tx, rx) = futures::sync::mpsc::channel(25);

            let forward = sink.send_all(rx.map_err(|_| tzmq::Error::Sink));

            Actor::create(|ctx| {
                ctx.spawn(wrap_future(forward.drop_item().drop_err()));
                Publish {
                    handle,
                    sender: tx,
                }
            })
        })
    }
}
