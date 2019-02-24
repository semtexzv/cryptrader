/*
 * This file is part of Futures ZMQ.
 *
 * Copyright © 2018 Riley Trautman
 *
 * Futures ZMQ is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Futures ZMQ is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Futures ZMQ.  If not, see <http://www.gnu.org/licenses/>.
 */
//! Futures ZMQ, bringing ZeroMQ any futures runtime.
//!
//!
//! Futures ZMQ contains wrappers around ZeroMQ Concepts with Futures. It shares an external API
//! with [tokio-zmq](https://docs.rs/tokio-zmq), but unlike tokio-zmq, futures-zmq is OS and
//! Executor agnostic. This comes at the cost of performance, as futures-zmq relies on spinning up
//! a separate thread for managing the ZeroMQ sockets, while tokio-zmq can avoid this issue by
//! letting mio manage the sockets.
//!
//! This crate provides Streams, Sinks, and Futures for ZeroMQ Sockets, which deal in structures
//! caled Multiparts. Currently, a Multipart is a simple wrapper around `VecDeque<zmq::Message>`,
//! but in the future this will be represented as a wrapper around `VecDeque<S: zmq::Sendable>`
//! with the zmq 0.9 release.
//!
//! # Creating a socket
//!
//! To get a new socket, you must invoke the Socket builder. The Socket Builder can output a
//! 'raw' Socket, or any specific kind of socket, such as Rep, Req, etc. The result of the builder
//! can be any compatable kind of socket, so specifiying a type is important.
//!
//! Once you have a socket, if it implements `StreamSocket`, you can use the socket's `.stream()`
//! and `.recv()`, if it implements `SinkSocket`, you can use the socket's `.sink(usize)` and
//! `.send(Multipart)`.
//!
//! Without further ado, creating and using a socket:
//!
//! ```rust
//! extern crate zmq;
//! extern crate futures;
//! extern crate tokio;
//! extern crate futures_zmq;
//!
//! use std::sync::Arc;
//!
//! use futures::{Future, Stream};
//! use futures_zmq::{prelude::*, Socket, Pub, Sub, Error};
//!
//! fn run() -> Result<(), Error> {
//!     // Create a new ZeroMQ Context. This context will be used to create all the sockets.
//!     let context = Arc::new(zmq::Context::new());
//!
//!     // Create our two sockets using the Socket builder pattern.
//!     // Note that the variable is named zpub, since pub is a keyword
//!     let zpub = Pub::builder(Arc::clone(&context))
//!         .bind("tcp://*:5561")
//!         .build();
//!
//!     let sub = Sub::builder(context)
//!         .bind("tcp://*:5562")
//!         .filter(b"")
//!         .build();
//!
//!     // Create our simple server. This forwards messages from the Subscriber socket to the
//!     // Publisher socket, and prints them as they go by.
//!     let runner = zpub
//!         .join(sub)
//!         .and_then(|(zpub, sub)| {
//!             sub.stream()
//!                 .map(|multipart| {
//!                     for msg in &multipart {
//!                         if let Some(msg) = msg.as_str() {
//!                             println!("Forwarding: {}", msg);
//!                         }
//!                     }
//!                     multipart
//!                 })
//!                 .forward(zpub.sink(25))
//!         });
//!
//!     // To avoid an infinte doctest, the actual tokio::run is commented out.
//!     // tokio::run(runner.map(|_| ()).or_else(|e| {
//!     //     println!("Error: {}", e);
//!     // })?;
//!     # let _ = runner;
//!     # Ok(())
//! }
//!
//! # fn main() {
//! #     run().unwrap();
//! # }
//! ```

pub mod async_types;
pub mod error;
mod polling;
pub mod prelude;
mod socket;

use lazy_static::lazy_static;

pub use async_zmq_types::Multipart;

pub use self::{
    error::Error,
    polling::{RecvFuture, SendFuture, Session},
    socket::{
        types::{Dealer, Pair, Pub, Pull, Push, Rep, Req, Router, Sub, Xpub, Xsub},
        Socket,
    },
};

lazy_static! {
    pub static ref SESSION: Session = Session::new();
}
