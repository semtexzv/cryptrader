use prelude::*;

use base::{
    msg::{
        RemoteMessage, RemoteError,
    }
};
use addr::{
    RemoteActor, RemoteAddr,
    comm::ActorType,
};


pub struct RegisterRemoteActor<A: RemoteActor> {
    pub addr: Addr<A>,
}

unsafe impl<A: RemoteActor> Send for RegisterRemoteActor<A> {}

impl<A: RemoteActor> Message for RegisterRemoteActor<A> {
    type Result = RemoteAddr<A>;
}


pub struct SendAddressedMessage<M>
    where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
          M::Result: Send + Serialize + DeserializeOwned + 'static
{
    pub(crate) msg: M,
    pub(crate) actor_type: ActorType,
    pub(crate) node_id: Uuid,
    pub(crate) actor_id: Uuid,
}

impl<M> SendAddressedMessage<M>
    where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
          M::Result: Send + Serialize + DeserializeOwned + 'static
{
    fn node_addr(&self) -> Uuid {
        return self.node_id.clone();
    }

    fn actor_addr(&self) -> Uuid {
        return self.actor_id.clone();
    }
}

impl<M> Message for SendAddressedMessage<M>
    where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
          M::Result: Send + Serialize + DeserializeOwned + 'static
{
    type Result = Result<M::Result, RemoteError>;
}

pub struct AddressedRequest<M>
    where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
          M::Result: Send + Serialize + DeserializeOwned + 'static
{
    pub(crate) inner: RecipientRequest<SendAddressedMessage<M>>,
}


impl<M> ::futures::Future for AddressedRequest<M>
    where M: RemoteMessage + Send + Serialize + DeserializeOwned,
          M::Result: Send + Serialize + DeserializeOwned
{
    type Item = M::Result;
    type Error = RemoteError;

    #[inline(always)]
    fn poll(&mut self) -> Result<Async<Self::Item>, Self::Error> {
        return match self.inner.poll() {
            Ok(Async::Ready(Ok(data))) => Ok(Async::Ready(data)),
            Ok(Async::Ready(Err(e))) => Err(e.into()),
            Ok(Async::NotReady) => Ok(Async::NotReady),
            Err(e) => Err(e.into())
        };
    }
}

///
/// Bytes -> Msg lookup on l1
/// Msg -> Handler hashtable
/// Handle hashtable -> Actor
///
#[derive(Debug, Serialize, Deserialize)]
pub struct AddressedMessage<M>
{
    pub(crate) msg: M,
    pub(crate) node_id: Uuid,
    pub(crate) actor_id: Uuid,

}

impl<M> Message for AddressedMessage<M>
    where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
          M::Result: Send + Serialize + DeserializeOwned + 'static
{
    type Result = Result<M::Result, RemoteError>;
}


impl<M> RemoteMessage for AddressedMessage<M>
    where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
          M::Result: Send + Serialize + DeserializeOwned + 'static
{}