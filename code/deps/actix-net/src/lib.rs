#![feature(box_syntax, core_intrinsics)]
#![feature(specialization)]

#![allow(unused_imports, dead_code, unused_variables)]
//! Architecture:
//!
//! Communicator will be actor on this that will constitute a network interface
//! It will have `connect` method, that will initiate connection to remote process
//! This method will return Future<Addr<Node>>. Node will have method `remote_recipient<M>`
//! that will return Recipient<M>, this recipient will internally send msgs to source node,
//! and the node in turn will Send them over ZMQ to communicator
//!
//! Local actors can register for specific message types by calling `register<M>` on communicator.
//! This will do 2 things, Add recipient from source actor to internal structure of communicator,
//! And mark this message type as Receivable. Communicator will then send Message type as receivable
//! to all connected nodes.
//!
//! PubSub ? Special message Type : `Announcement` That will HAVE TO Return ().
//! Then, communicator will have method `subscribe(addr,recipient)` That will create internal Sub socket
//! connected to remote `addr` and register specified recipient for announcements of specified type from this source node
//!  Communicator will also have method `announce` that will send Announcement to all connected nodes to this communicator.
//!
//! There can be multiple communicators in single process (think primary data stream & monitoring).
//!
//! TODO: Have Communicator as some normal struct, or pass it around as actor, and force method calls to be Messages ?
//! TODO: Communicator, or nodes, who will work with heartbeats
//! TODO: Is Node an actor, or just internal structure that will forward to desired communicator ?
//!
//! Implementation :
//! Communicator will have one `Router::bind` socket. And one `Dealer::connect` socket per connected node
//!
//! For pubSub: Each Communicator will have one `Pub::bind` socket, and one `Sub::connect` socket per connected subscribed node
//! TODO: Maybe separate PubSub into `Announcer` instead of communicator ?? (Same idea, but only used for pubsub).
//!
//! Separate Addressing of each Actor ? maybe `register_addressed(string, recipient)` that will locally resolve
//! Specific actor. sender wishing to send to actor A on node N will have to provide address in form of 'N/A'
//! Or some similar hierarchical model.
//!
//! We can use physical node address as N part, or use local alias. Remote node will either have to
//! confirm that it received message and routed it to correct actor, or upon actor registration
//! publish this information to remote nodes.
//!
//! Load balancing ? This is problem for "actix-arch" and will be resolved on higher layer.
//! We will have Actor, that will wrap communicator, that will load balance among static/dynamic remote nodes
//! and will collect results accordingly.
//!
//! Service discovery ? Again, problem for "actix-arch".  Again a level higher. Special actor
//! With message `Resolve(name)` that will return Address of a node.
//!
//! Dynamic creation of actors on remote machines ? Again, specific actor, `Creator` that will
//! register itself on `Communicator` and listen to  `Create(Args)` Message

extern crate common;


pub extern crate zmq;
pub extern crate tokio_zmq as tzmq;
pub extern crate trust_dns_resolver;
pub extern crate futures;
pub extern crate tokio;
pub extern crate uuid;
extern crate anymap;
extern crate failure;

pub mod prelude;
pub mod base;
pub mod addr;
pub mod pubsub;

use common::prelude::*;
use futures::prelude::*;
pub use base::{
    msg::{
        RemoteMessage,
        RemoteError,
        RegisterRecipientHandler,
    },
};


use base::{
    node::BaseNode,
    msg::{
        ConnectToNode,
        NodeConnected,
        SendRemoteRequest,
    },
};

use addr::{
    RemoteActor,
    RemoteAddr,
    RemoteRef,
    comm::Communicator,
    msg::RegisterRemoteActor,
};

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
        where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
              M::Result: Send + Serialize + DeserializeOwned + 'static
    {
        self.addr.send(RegisterRecipientHandler::new(rec))
    }

    pub fn do_register_recipient<M>(&self, rec: Recipient<M>)
        where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
              M::Result: Send + Serialize + DeserializeOwned + 'static
    {
        self.addr.do_send(RegisterRecipientHandler::new(rec))
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

pub struct NodeAddr {
    addr: Addr<BaseNode>
}

impl NodeAddr {
    pub(crate) fn new(addr: Addr<BaseNode>) -> Self {
        NodeAddr { addr }
    }
    pub fn send<M>(&self, msg: M) -> impl Future<Item=M::Result, Error=RemoteError>
        where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
              M::Result: Send + Serialize + DeserializeOwned + 'static {
        self.addr.send(SendRemoteRequest(msg)).flatten()
    }

    pub fn do_send<M>(&self, msg: M)
        where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
              M::Result: Send + Serialize + DeserializeOwned + 'static {
        self.addr.do_send(SendRemoteRequest(msg))
    }
}

use trust_dns_resolver::lookup::SrvLookup;

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