use crate::prelude::*;

use actix_comm::msg::{Remotable, RemoteMessage, RemoteError};
use actix_comm::ctx::ContextHandle;


use actix_comm::msg::SendRequest;

pub trait ServiceInfo: 'static + Debug {
    type RequestType: Remotable + Debug;
    type ResponseType: Remotable + Debug;
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

pub struct ServiceConnection<S: ServiceInfo> {
    _s: PhantomData<S>,
    inner: Addr<actix_comm::req::Request>,
}

impl<S: ServiceInfo> Clone for ServiceConnection<S> {
    fn clone(&self) -> Self {
        ServiceConnection {
            _s: PhantomData,
            inner: self.inner.clone(),
        }
    }
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


    pub fn from_other<SS: ServiceInfo>(_handle: ContextHandle, o: &ServiceConnection<SS>) -> Self {
        return Self {
            _s: PhantomData,
            inner: o.inner.clone(),
        };
    }

    pub fn from_req(req: Addr<actix_comm::req::Request>) -> Self {
        return ServiceConnection {
            _s: PhantomData,
            inner: req,
        };
    }

    pub fn send(&self, req: S::RequestType) -> BoxFuture<S::ResponseType, RemoteError> {
        let req = ServiceRequest::<S>(req);
        let sent = self.inner.send(SendRequest(req)).map_err(RemoteError::from);
        let sent = sent.and_then(|r| {
            if let Err(ref e) = r {
                info!("Error with SendRequest : layer 1 : {:?}", e)
            }
            r
        });
        let sent = sent.and_then(|r| {
            if let Err(ref e) = r {
                info!("Error with SendRequest : layer 1 : {:?}", e)
            }
            r
        });

        let sent: BoxFuture<S::ResponseType, RemoteError> = box sent;
        return sent;
    }
}


#[derive(Message)]
#[rtype(result = "Result<S::ResponseType,RemoteError>")]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ServiceRequest<S: ServiceInfo>(pub S::RequestType);

pub struct ServiceHandler<S: ServiceInfo> {
    _s: PhantomData<S>,
    inner: Addr<actix_comm::rep::Reply>,
}

impl<S: ServiceInfo> Clone for ServiceHandler<S> {
    fn clone(&self) -> Self {
        ServiceHandler {
            _s: PhantomData,
            inner: self.inner.clone(),
        }
    }
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

    pub fn from_other<SS: ServiceInfo>(_handle: ContextHandle, o: &ServiceHandler<SS>) -> Self {
        return Self {
            _s: PhantomData,
            inner: o.inner.clone(),
        };
    }

    pub fn register(&self, rec: Recipient<ServiceRequest<S>>) {
        self.inner.do_send(actix_comm::RegisterHandler(rec));
    }
}


pub struct Publisher<E: EndpointInfo> {
    _e: PhantomData<E>,
    inner: Addr<actix_comm::Publish>,
}

impl<E: EndpointInfo> Clone for Publisher<E> {
    fn clone(&self) -> Self {
        Publisher { inner: self.inner.clone(), _e: PhantomData }
    }
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