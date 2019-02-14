#![feature(box_syntax, core_intrinsics, trait_alias)]
#![feature(specialization)]

#![allow(unused_imports, dead_code, unused_variables)]

pub mod prelude;
pub mod ctx;
pub mod msg;
pub mod base;
pub mod addr;
pub mod pubsub;


use crate::prelude::*;
pub use msg::*;
use base::comm::*;
use base::node::*;

use addr::*;
use addr::msg::*;


///
/// TODO: Extract code from Comm and Node
/// Make some base context, and extract communication, registration and sending to classes similar to Publisher, Subscriber
#[derive(Clone)]
pub struct CommAddr {
    addr: Addr<Communicator>
}

impl CommAddr {
    pub fn new(addr: &str) -> Result<Self, failure::Error> {
        return Communicator::new(&addr).map(|v| CommAddr { addr: v });
    }

    #[must_use]
    pub fn connect_to(&self, addr: String) -> impl Future<Item=NodeAddr, Error=Error> {
        self.addr.send(ConnectToNode::new(addr)).flatten().map(|v| NodeAddr::new(v))
    }

    #[must_use]
    pub fn register_recipient<M>(&self, rec: Recipient<M>) -> impl Future<Item=(), Error=MailboxError>
        where M: RemoteMessage + Remotable,
              M::Result: Remotable
    {
        self.addr.send(RegisterHandler::new(rec))
    }

    pub fn do_register_recipient<M>(&self, rec: Recipient<M>)
        where M: RemoteMessage + Remotable,
              M::Result: Remotable
    {
        self.addr.do_send(RegisterHandler::new(rec))
    }

    pub fn register_actor<A: RemoteActor>(&self, addr: Addr<A>) -> impl Future<Item=RemoteAddr<A>, Error=MailboxError> {
        return self.addr.send(RegisterRemoteActor { addr });
    }

    pub fn resolve_addr<A: RemoteActor>(&self, r: RemoteRef<A>) -> RemoteAddr<A> {
        return RemoteAddr { r, comm: self.addr.clone() };
    }
    /// Publish to specific address, where listener called `CommAddr::subscribe_on`
    pub fn publish_to(&self, addr: &str) -> Publisher {
        Publisher {}
    }
    /// Publish on local address, listeners can connect by `ComAddr::subscribe_to`
    pub fn publish_on(&self, local_addr: &str) -> Publisher {
        unimplemented!()
    }
    /// Subscribe to remote address, on which a publisher created by `ComAddr::subsribe_on`
    pub fn subscribe_to(&self, addr: &str) -> Subscriber {
        unimplemented!()
    }
    /// Subscribe to publishers on local address, publishers connect by `ComAddr::subscibe_to`
    pub fn subscribe_on(&self, local_addr: &str) -> Subscriber {
        unimplemented!()
    }
}

pub enum Subscriber {}

pub struct Publisher {}

#[derive(Clone)]
pub struct NodeAddr {
    addr: Addr<BaseNode>
}

impl NodeAddr {
    pub(crate) fn new(addr: Addr<BaseNode>) -> Self {
        NodeAddr { addr }
    }
    pub fn send<M>(&self, msg: M) -> impl Future<Item=M::Result, Error=RemoteError>
        where M: RemoteMessage + Remotable,
              M::Result: Remotable {
        self.addr.send(SendRemoteRequest(msg)).flatten()
    }

    pub fn do_send<M>(&self, msg: M)
        where M: RemoteMessage + Remotable,
              M::Result: Remotable {
        self.addr.do_send(SendRemoteRequest(msg))
    }
}

use trust_dns_resolver::lookup::SrvLookup;
use crate::addr::comm::Communicator;
use crate::msg::RemoteMessage;
use crate::base::node::BaseNode;

//  _actor-endpoint._tcp.ingest.default.svc.cluster.local.
/*
pub fn resolve(service: &str, proto: &str, domain: &str) -> impl Future<Item=SrvLookup, Error=Error> {
    use common::actix::actors::resolver::{self, *};

    let resolver = resolver::Resolver::from_registry();

    let name = format!("_{svc}._{proto}.{domain}.", svc = service, proto = proto, domain = domain);

    let (res, fut) = trust_dns_resolver::AsyncResolver::new(Default::default(), Default::default());

    tokio::spawn(fut);

    return res.lookup_srv(name)
        .then(|l| {

            if let Ok(r)  = l {
                for l in r.iter() {
                    return Ok(r.clone());
                }
            }
            bail!("Could not resolve");
        });
}
*/