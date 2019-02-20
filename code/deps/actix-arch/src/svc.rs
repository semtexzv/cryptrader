use crate::prelude::*;

use actix_comm::msg::{Remotable, RemoteMessage, RemoteError, Announcement};
use actix_comm::ctx::ContextHandle;


use futures_util::FutureExt;

pub trait ServiceInfo: 'static {
    type RequestType: RemoteMessage<Result=Self::ResponseType> + Remotable;
    type ResponseType: Remotable;
    const ENDPOINT: &'static str;
}

pub trait FanType {
    fn subscribe(handle: actix_comm::ContextHandle, addr: &str) -> BoxFuture<Addr<actix_comm::Subscribe>, tzmq::Error>;
    fn publish(handle: actix_comm::ContextHandle, addr: &str) -> BoxFuture<Addr<actix_comm::Publish>, tzmq::Error>;
}


fn addr_to_zmq_local(addr: &str) -> String {
    let url = Url::parse(addr).unwrap();
    let addr = format!("tcp://*:{}", url.port().unwrap_or(42000));
    addr
}

fn addr_to_zmq_remote(addr: &str) -> String {
    let url = Url::parse(addr).unwrap();
    let addr = format!("tcp://{}:{}", url.host().unwrap(), url.port().unwrap_or(42000));
    addr
}

pub struct FanOut {}

impl FanType for FanOut {
    fn subscribe(handle: actix_comm::ContextHandle, addr: &str) -> BoxFuture<Addr<actix_comm::Subscribe>, tzmq::Error> {
        let addr = addr_to_zmq_remote(addr);
        println!("Subscribing to {}", addr);


        box actix_comm::Subscribe::connect(handle, &addr)
    }
    fn publish(handle: actix_comm::ContextHandle, addr: &str) -> BoxFuture<Addr<actix_comm::Publish>, tzmq::Error> {
        let addr = addr_to_zmq_local(addr);
        println!("Publishing on {}", addr);

        box actix_comm::Publish::bind(handle, &addr)
    }
}

pub struct FanIn {}

impl FanType for FanIn {
    fn subscribe(handle: actix_comm::ContextHandle, addr: &str) -> BoxFuture<Addr<actix_comm::Subscribe>, tzmq::Error> {
        let addr = addr_to_zmq_local(addr);
        println!("Subscribing on {}", addr);

        box actix_comm::Subscribe::bind(handle, &addr)
    }
    fn publish(handle: actix_comm::ContextHandle, addr: &str) -> BoxFuture<Addr<actix_comm::Publish>, tzmq::Error> {
        let addr = addr_to_zmq_remote(addr);
        println!("Publishing to {}", addr);

        box actix_comm::Publish::connect(handle, &addr)
    }
}

pub trait EndpointInfo {
    type MsgType: RemoteMessage<Result=()> + Remotable;
    type FanType: FanType = FanOut;
    const ENDPOINT: &'static str;
}

#[derive(Clone)]
pub struct ServiceConnection<S: ServiceInfo> {
    _s: PhantomData<S>,
    inner: Addr<actix_comm::req::Request>,
}


impl<S: ServiceInfo> ServiceConnection<S> {
    pub fn new(handle: ContextHandle) -> BoxFuture<Self, tzmq::Error> {
        let addr = addr_to_zmq_remote(S::ENDPOINT);
        let req = actix_comm::req::Request::new(handle, &addr);
        println!("Connecting to {}", addr);

        return box req.map(|req| {
            ServiceConnection {
                _s: PhantomData,
                inner: req,
            }
        });
    }
    pub fn from_req(req: Addr<actix_comm::req::Request>) -> Self {
        return ServiceConnection {
            _s: PhantomData,
            inner: req,
        };
    }

    pub fn send(&self, req: S::RequestType) -> BoxFuture<S::ResponseType, RemoteError> {
        return box self.inner.send(actix_comm::SendRequest(req)).map_err(Into::into).map(|x| x.unwrap());
    }
}

#[derive(Clone)]
pub struct ServiceHandler<S: ServiceInfo> {
    _s: PhantomData<S>,
    inner: Addr<actix_comm::rep::Reply>,
}


impl<S: ServiceInfo> ServiceHandler<S> {
    pub fn new(handle: ContextHandle) -> BoxFuture<Self, tzmq::Error> {
        let addr = addr_to_zmq_local(S::ENDPOINT);
        let rep = actix_comm::rep::Reply::new(handle, &addr);
        println!("Listening on  {}", addr);
        return box rep.map(|rep| {
            ServiceHandler {
                _s: PhantomData,
                inner: rep,
            }
        });
    }

    pub fn register(&self, rec: Recipient<S::RequestType>) {
        self.inner.do_send(actix_comm::RegisterHandler(rec));
    }
}


pub struct Publisher<E: EndpointInfo> {
    _e: PhantomData<E>,
    inner: Addr<actix_comm::Publish>,
}


impl<E: EndpointInfo> Publisher<E> {
    pub fn new(handle: ContextHandle) -> BoxFuture<Self, tzmq::Error> {
        let add = E::FanType::publish(handle, E::ENDPOINT);

        return box add.map(|add| {
            Publisher {
                _e: PhantomData,
                inner: add,
            }
        });
    }

    pub fn do_publish(&self, i: E::MsgType) {
        Arbiter::spawn(self.inner.send(actix_comm::SendRequest(i)).unwrap_err().set_err(()).map(|_| ()));
    }

}


#[derive(Clone)]
pub struct Subscriber<E: EndpointInfo> {
    _e: PhantomData<E>,
    inner: Addr<actix_comm::Subscribe>,
}

unsafe impl<E: EndpointInfo> Send for Subscriber<E> {}

impl<E: EndpointInfo> Subscriber<E> {
    pub fn new(handle: ContextHandle) -> BoxFuture<Self, tzmq::Error> {
        let add = E::FanType::subscribe(handle, E::ENDPOINT);

        return box add.map(|add| {
            Subscriber {
                _e: PhantomData,
                inner: add,
            }
        });
    }

    pub fn register(&self, rec: Recipient<E::MsgType>) {
        self.inner.do_send(actix_comm::RegisterHandler(rec));
    }
}