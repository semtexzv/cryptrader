use crate::prelude::*;


use actix_comm::msg::{Remotable, RemoteMessage, RemoteError, Announcement};

pub trait ServiceInfo {
    type RequestType: RemoteMessage<Result=Self::ResponseType> + Remotable;
    type ResponseType: Remotable;
    const ENDPOINT: &'static str;
}

pub trait EndpointInfo {
    type MsgType = RemoteMessage<Result=()>;
    const ENDPOINT: &'static str;
}


pub struct ServiceConnection<S: ServiceInfo> {
    _s: PhantomData<S>,
}

pub struct ServiceHandler<S: ServiceInfo> {
    _s: PhantomData<S>,
}


pub struct Publisher<>