use crate::prelude::*;


use actix_comm::msg::{Remotable, RemoteMessage, RemoteError, Announcement};

pub trait ServiceInfo {
    type RequestType: RemoteMessage<Result=Self::ResponseType> + Send + Debug + Serialize + DeserializeOwned + 'static;
    type ResponseType: Send + Debug + Serialize + DeserializeOwned + 'static;
    const ENDPOINT: &'static str;
}

pub trait EndpointInfo {
    type ConnType: ConnectionInfo;
    const ENDPOINT: &'static str;
}

pub trait ConnectionInfo {
    type InputType: Remotable;
    type OutputType: Remotable;
}

pub struct ReqRepServiceConnectionInfo<M>
    where M: RemoteMessage + Remotable,
          M::Result: Remotable
{
    _p: PhantomData<M>
}

impl<M> ConnectionInfo for ReqRepServiceConnectionInfo<M>
    where M: RemoteMessage + Remotable,
          M::Result: Remotable,
{
    type InputType = M;
    type OutputType = M::Result;
}


pub struct PubConnectionInfo<M>
    where M: Announcement + Remotable {
    _p: PhantomData<M>
}

impl<M> ConnectionInfo for PubConnectionInfo<M>
    where M: Announcement + Remotable {
    type InputType = ();
    type OutputType = M;
}


pub struct SubConnectionInfo<M>
    where M: Announcement + Remotable {
    _p: PhantomData<M>
}

impl<M> ConnectionInfo for SubConnectionInfo<M>
    where M: Announcement + Remotable {
    type InputType = M;
    type OutputType = ();
}

