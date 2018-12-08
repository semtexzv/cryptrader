use ::prelude::*;

pub mod comm;
pub mod msg;

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

unsafe impl<A: RemoteActor> Send for RemoteRef<A> {}

impl<A: RemoteActor> Clone for RemoteRef<A> {
    fn clone(&self) -> Self {
        RemoteRef {
            node_id: self.node_id.clone(),
            actor_id: self.actor_id.clone(),
            _p: PhantomData,
        }
    }
}

#[derive(Clone)]
pub struct RemoteAddr<A: RemoteActor> {
    pub(crate) r: RemoteRef<A>,
    pub(crate) comm: Addr<comm::Communicator>,
}
impl<A, M, B> actix::dev::MessageResponse<A, M> for RemoteAddr<B>
    where A: Actor,
          B: RemoteActor,
          M: Message<Result=RemoteAddr<B>>,
          B: Actor
{
    fn handle<R: actix::dev::ResponseChannel<M>>(self, ctx: &mut <A as Actor>::Context, tx: Option<R>) {
        if let Some(tx) = tx {
            tx.send(self);
        }
    }
}

impl<A: RemoteActor> Deref for RemoteAddr<A> {
    type Target = RemoteRef<A>;

    fn deref(&self) -> &<Self as Deref>::Target {
        return &self.r;
    }
}

impl<A: RemoteActor> RemoteAddr<A> {
    pub fn to_ref(&self) -> RemoteRef<A> {
        return self.r.clone();
    }
}






impl<A: RemoteActor> RemoteAddr<A> {
    pub fn from_ref(ctx: Addr<comm::Communicator>, r: &RemoteRef<A>) -> Self {
        return RemoteAddr {
            comm: ctx.clone(),
            r: r.clone(),
        };
    }

    pub fn send<M>(&self, msg: M) -> msg::AddressedRequest<M>
        where A: Handler<M>,
              M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
              M::Result: Send + Serialize + DeserializeOwned
    {
        let rec = self.comm.clone().recipient::<msg::SendAddressedMessage<M>>();
        msg::AddressedRequest {
            inner: rec.send(msg::SendAddressedMessage {
                msg,
                actor_type: A::type_id().into(),
                node_id: self.r.node_id,
                actor_id: self.r.actor_id,
            })
        }
    }
    pub fn do_send<M>(&self, msg: M)
        where A: Handler<M>,
              M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
              M::Result: Send + Serialize + DeserializeOwned
    {
        self.comm.do_send(msg::SendAddressedMessage {
            msg,
            actor_type: A::type_id().into(),
            node_id: self.r.node_id,
            actor_id: self.r.actor_id,
        })
    }

    pub fn try_send<M>(&self, msg: M) -> Result<(), SendError<M>>
        where A: Handler<M>,
              M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
              M::Result: Send + Serialize + DeserializeOwned
    {
        self.comm.try_send(msg::SendAddressedMessage {
            msg,
            actor_type: A::type_id().into(),
            node_id: self.r.node_id,
            actor_id: self.r.actor_id,
        }).map_err(|e| unimplemented!())
    }
}