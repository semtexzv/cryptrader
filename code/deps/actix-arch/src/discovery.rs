use ::prelude::*;
use common::futures::Async;

pub struct ServiceDiscoveryRequest {
    inner: Box<Future<Item=SocketAddr, Error=failure::Error>>
}

impl Future for ServiceDiscoveryRequest {
    type Item = SocketAddr;
    type Error = failure::Error;

    #[inline]
    fn poll(&mut self) -> Result<Async<<Self as Future>::Item>, <Self as Future>::Error> {
        self.inner.poll()
    }
}

pub trait ServiceDiscovery {
    fn resolve(&self, addr : &str) -> ServiceDiscoveryRequest;
}