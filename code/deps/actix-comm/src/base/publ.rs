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
        let mut multipart = wrapped.to_multipart().unwrap();

        multipart.push_front(zmq::Message::from_slice(&[]));

        let sent = wrap_future(self.sender.clone().send(multipart).unwrap_err().set_err(()).drop_item());

        ctx.spawn(sent);
        Ok(())
    }
}


impl Publish {
    pub fn bind(handle: ContextHandle, addr: &str) -> impl Future<Item=Addr<Self>, Error=tzmq::Error> {
        let socket = tzmq::Pub::builder(handle.zmq_ctx.clone())
            .identity(handle.uuid.as_bytes())
            .bind(addr)
            .build();

        Self::create(handle, socket)
    }

    pub fn connect(handle: ContextHandle, addr: &str) -> impl Future<Item=Addr<Self>, Error=tzmq::Error> {
        let socket = tzmq::Pub::builder(handle.zmq_ctx.clone())
            .identity(handle.uuid.as_bytes())
            .connect(addr)
            .build();

        Self::create(handle, socket)
    }

    fn create(handle: ContextHandle, socket: Result<Pub, tzmq::Error>) -> impl Future<Item=Addr<Self>, Error=tzmq::Error> {
        future::result(socket.map(|socket| {
            let sink = socket.sink();
            let (tx, rx) = futures::sync::mpsc::channel(25);

            let forward = sink.send_all(rx.map_err(|_| tzmq::Error::Sink));

            Actor::create(|ctx| {

                ctx.spawn(wrap_future(forward.map(|x| {
                    panic!("Forwarder ended")
                }).drop_item().drop_err()));

                Publish {
                    handle,
                    sender: tx,
                }
            })
        }))
    }
}
