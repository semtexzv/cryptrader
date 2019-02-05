use crate::prelude::*;


use actix_net::{
    prelude::*,
    RemoteMessage,
    Remotable,
    base::msg::Announcement,
};

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




pub struct ServiceConnection<S: ServiceInfo> {
    comm: actix_net::CommAddr,
    node: actix_net::NodeAddr,
    _p: PhantomData<S>,
}

impl<S: ServiceInfo> ServiceConnection<S> {
    fn new(comm: actix_net::CommAddr) -> impl Future<Item=Self, Error=Error> {
        let url = Url::parse(S::ENDPOINT).unwrap();
        comm.clone().connect_to(url.host().unwrap().to_string())
            .map(|node| {
                ServiceConnection {
                    comm,
                    node,
                    _p: PhantomData,
                }
            })
    }
    fn send(&self, req: S::RequestType) -> impl Future<Item=S::ResponseType, Error=Error> {
        self.node.send(req).from_err()
    }
}