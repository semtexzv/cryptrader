#![feature(box_syntax, core_intrinsics)]
#![feature(specialization)]

#![allow(unused_imports,dead_code,unused_variables)]
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
pub extern crate futures;
pub extern crate tokio;
pub extern crate uuid;
extern crate anymap;
extern crate failure;


pub mod prelude;

pub mod base;
pub mod addr;
