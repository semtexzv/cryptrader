use crate::prelude::*;
use crate::msg::*;
use tzmq::prelude::*;

/*
pub(crate) fn set_keepalive_opts<S>(s: S) -> S
    where S: From<(zmq::Socket, tzmq::async_types::EventedFile)> + IntoInnerSocket<Socket=tzmq::Socket> {
    let socket = s.socket();
    let (socket, file): (zmq::Socket, tzmq::async_types::EventedFile) = socket.inner();
    socket.set_tcp_keepalive(1).unwrap();
    socket.set_tcp_keepalive_cnt(2).unwrap();
    socket.set_tcp_keepalive_idle(4).unwrap();
    socket.set_tcp_keepalive_intvl(4).unwrap();

    S::from((socket, file))
}
*/

pub(crate) fn set_keepalives(socket : &zmq::Socket) {

    socket.set_tcp_keepalive(1).unwrap();
    socket.set_tcp_keepalive_cnt(2).unwrap();
    socket.set_tcp_keepalive_idle(2).unwrap();
    socket.set_tcp_keepalive_intvl(5).unwrap();
}


#[derive(Message)]
#[rtype(result = "Result<WrappedType,RemoteError>")]
pub(crate) struct ErasedMessage(MsgType, WrappedType);

pub(crate) trait MessageHandler: Send {
    fn handle(&self, typ: MsgType, msg: WrappedType, sender: OneSender<Result<WrappedType, RemoteError>>);
}


pub(crate) struct RecipientHandler<M>(pub(crate) Recipient<M>)
    where M: RemoteMessage + Remotable,
          M::Result: Remotable;

impl<M> MessageHandler for RecipientHandler<M>
    where M: RemoteMessage + Remotable,
          M::Result: Remotable
{
    fn handle(&self, typ: MsgType, msg: WrappedType, sender: OneSender<Result<WrappedType, RemoteError>>) {
        let msg = M::from_wrapped(&msg).unwrap();
        let fut = self.0.send(msg);
        let fut = fut.then(move |res| {
            let reply = res
                .map(|data| M::res_to_wrapped(&data).unwrap())
                .map_err(Into::into);
            sender.send(reply).unwrap();
            Ok::<_, ()>(())
        });

        Arbiter::spawn(fut);
    }
}

pub(crate) struct DefaultHandler(pub(crate) Recipient<ErasedMessage>);

impl MessageHandler for DefaultHandler {
    fn handle(&self, typ: MsgType, msg: WrappedType, sender: OneSender<Result<WrappedType, RemoteError>>) {
        let fut = self.0.send(ErasedMessage(typ, msg));
        let fut = fut.then(move |res| {
            let res = res.map_err(|_| RemoteError::MailboxClosed).and_then(|e| e);
            sender.send(res).unwrap();
            Ok::<_, ()>(())
        });

        Arbiter::spawn(fut);
    }
}

#[derive(Default)]
pub(crate) struct HandlerRegistry(HashMap<MsgType, Box<MessageHandler>>, Option<Box<MessageHandler>>);

impl HandlerRegistry {
    pub fn register(&mut self, typ: MsgType, handler: Box<MessageHandler>) {
        self.0.insert(typ, handler);
    }
    pub fn get(&self, typ: &MsgType) -> Option<&Box<MessageHandler>> {
        return self.0.get(typ).or(self.1.as_ref());
    }
    pub fn unregister(&mut self, typ: &MsgType) -> Option<Box<MessageHandler>> {
        self.0.remove(typ)
    }
    pub fn set_default(&mut self, handler: Box<MessageHandler>) {
        self.1 = Some(handler)
    }
}

