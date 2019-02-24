/*
 * This file is part of Tokio ZMQ.
 *
 * Copyright © 2018 Riley Trautman
 *
 * Tokio ZMQ is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Tokio ZMQ is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Tokio ZMQ.  If not, see <http://www.gnu.org/licenses/>.
 */

//! Provide useful types and traits for working with Tokio ZMQ.

use std::time::Duration;

use futures::{Future, Stream};

pub use async_zmq_types::{
    ControlHandler, Controllable, EndHandler, HasBuilder, IntoInnerSocket, SinkSocket,
    SinkStreamSocket, StreamSocket, WithEndHandler,
};

use crate::{async_types::TimeoutStream, error::Error};

/* ----------------------------------TYPES----------------------------------- */

/* ----------------------------------TRAITS---------------------------------- */

/// This trait allows adding a timeout to any stream with Error = Error.
pub trait WithTimeout: Stream<Error = Error> + Sized {
    /// Add a timeout to a given stream.
    ///
    /// ### Example, using a Pull wrapper type
    /// ```rust
    /// extern crate futures;
    /// extern crate tokio_zmq;
    /// extern crate zmq;
    ///
    /// use std::{sync::Arc, time::Duration};
    ///
    /// use futures::{Future, Stream};
    /// use tokio_zmq::{prelude::*, Socket, Pull, Multipart};
    ///
    /// fn main() {
    ///     let ctx = Arc::new(zmq::Context::new());
    ///     let fut = Pull::builder(ctx)
    ///         .bind("tcp://*:5574")
    ///         .build()
    ///         .and_then(|pull| {
    ///             // Receive a Timeout after 30 seconds if the stream hasn't produced a value
    ///             pull.stream()
    ///                 .timeout(Duration::from_secs(30))
    ///                 .for_each(|_| Ok(()))
    ///         });
    ///
    ///     // tokio::run(fut.map(|_| ()).or_else(|e| {
    ///     //     println!("Error: {}", e);
    ///     //     Ok(())
    ///     // }));
    /// }
    /// ```
    fn timeout(self, duration: Duration) -> TimeoutStream<Self>;
}

pub trait Build<T>: Sized {
    fn build(self) -> Box<dyn Future<Item = T, Error = Error> + Send>;
}

/* ----------------------------------impls----------------------------------- */

impl<T> WithTimeout for T
where
    T: Stream<Error = Error>,
{
    fn timeout(self, duration: Duration) -> TimeoutStream<Self> {
        TimeoutStream::new(self, duration)
    }
}
