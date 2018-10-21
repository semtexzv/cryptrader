use ::prelude::*;
use common::futures::Async;

/// Running service discovery request, will resolve into socket address or an error
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

/// Trait representing an interface to service discovery implementation
/// This will probably be implemented on address wrappers and actual service discover will be
/// implemented as an asynchronous actor
pub trait ServiceDiscovery {
    fn resolve(&self, addr : &str) -> ServiceDiscoveryRequest;
}