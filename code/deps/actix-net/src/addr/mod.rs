use ::prelude::*;

pub mod comm;

use base::{
    msg::RemoteMessage,
};


pub trait MessageRegistry<A: RemoteActor> {
    fn register<M>(&mut self)
        where A: Handler<M>,
              A::Context: actix::dev::ToEnvelope<A, M>,
              M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
              M::Result: Send + Serialize + DeserializeOwned + 'static;
}


pub trait RemoteActor: Actor {
    fn type_id() -> &'static str {
        unsafe { ::std::intrinsics::type_name::<Self>() }
    }

    fn register<R: MessageRegistry<Self>>(reg: &mut R);
}


#[derive(Debug, Serialize, Deserialize)]
pub struct RemoteRef<A: RemoteActor> {
    node_id: Uuid,
    actor_id: Uuid,
    _p: PhantomData<A>,
}

impl<A: RemoteActor> Clone for RemoteRef<A> {
    fn clone(&self) -> Self {
        RemoteRef {
            node_id: self.node_id.clone(),
            actor_id: self.actor_id.clone(),
            _p: PhantomData,
        }
    }
}


pub struct RemoteAddr<A: RemoteActor> {
    r: RemoteRef<A>,
    comm: Addr<comm::Communicator>,
}

impl<A: RemoteActor> RemoteAddr<A> {
    pub fn to_ref(&self) -> RemoteRef<A> {
        return self.r.clone();
    }
}
