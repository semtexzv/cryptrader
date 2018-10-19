use ::prelude::*;
use futures::sync::oneshot::{self, Sender};
use msg::RemoteError;
use msg::RemoteMessage;

pub trait MessageRegistry<A: RemoteActor> {
    fn register<M>(&mut self) where M: Message + Send, M::Result: Send;
}

pub trait RemoteActor: Actor {
    fn type_id() -> Cow<'static, str> {
        unsafe { ::std::intrinsics::type_name::<Self>().into() }
    }
    fn register_remote_messages<M: MessageRegistry<Self>>(m: &mut M);
}



pub trait ActorMessageHandler {
    fn handle(&self, msg_type_id: ::comm::MessageIdentity, msg: Bytes, sender: Sender<Result<Bytes, RemoteError>>);
}

pub struct LocalActorHandler<A: RemoteActor> {
    addr: Addr<A>,
}

impl<A: RemoteActor> LocalActorHandler<A> {
    pub fn new(addr: Addr<A>) -> Self {
        LocalActorHandler {
            addr
        }
    }
}

impl<A: RemoteActor> ActorMessageHandler for LocalActorHandler<A> {
    fn handle(&self, msg_type_id: ::comm::MessageIdentity, msg: Bytes, sender: Sender<Result<Bytes, RemoteError>>) {}
}
