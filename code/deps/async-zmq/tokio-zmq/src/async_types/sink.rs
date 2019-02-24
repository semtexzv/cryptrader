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

//! This module defines the `MultipartSink` type. A wrapper around Sockets that implements
//! `futures::Sink`.

use std::{fmt, marker::PhantomData};

use async_zmq_types::{IntoSocket, Multipart};
use futures::{Async, AsyncSink, Sink};
use zmq;

use crate::{
    async_types::{sink_type::SinkType, EventedFile},
    error::Error,
    socket::Socket,
};

/// The `MultipartSink` Sink handles sending streams of data to ZeroMQ Sockets.
///
/// You shouldn't ever need to manually create one. Here's how to get one from a 'raw' `Socket`'
/// type.
///
/// ### Example
/// ```rust
/// extern crate zmq;
/// extern crate futures;
/// extern crate tokio;
/// extern crate tokio_zmq;
///
/// use std::sync::Arc;
///
/// use futures::{Future, Sink};
/// use tokio_zmq::{prelude::*, Error, Multipart, Pub, Socket};
///
/// fn main() {
///     let context = Arc::new(zmq::Context::new());
///     let fut = Pub::builder(context)
///         .bind("tcp://*:5568")
///         .build()
///         .and_then(|zpub| {
///             let sink = zpub.sink(25);
///
///             let msg = zmq::Message::from_slice(b"Some message");
///
///             sink.send(msg.into())
///         });
///
///     // tokio::run(fut.map(|_| ()).map_err(|_| ()));
/// }
/// ```
pub struct MultipartSink<T>
where
    T: From<Socket>,
{
    sock: zmq::Socket,
    file: EventedFile,
    inner: SinkType,
    phantom: PhantomData<T>,
}

impl<T> MultipartSink<T>
where
    T: From<Socket>,
{
    pub fn new(buffer_size: usize, sock: zmq::Socket, file: EventedFile) -> Self {
        MultipartSink {
            sock,
            file,
            inner: SinkType::new(buffer_size),
            phantom: PhantomData,
        }
    }
}

impl<T> IntoSocket<T, Socket> for MultipartSink<T>
where
    T: From<Socket>,
{
    fn into_socket(self) -> T {
        T::from(Socket::from_sock_and_file(self.sock, self.file))
    }
}

impl<T> Sink for MultipartSink<T>
where
    T: From<Socket>,
{
    type SinkItem = Multipart;
    type SinkError = Error;

    fn start_send(
        &mut self,
        multipart: Self::SinkItem,
    ) -> Result<AsyncSink<Self::SinkItem>, Self::SinkError> {
        self.inner.start_send(multipart, &self.sock, &self.file)
    }

    fn poll_complete(&mut self) -> Result<Async<()>, Self::SinkError> {
        self.inner.poll_complete(&self.sock, &self.file)
    }
}

impl<T> fmt::Debug for MultipartSink<T>
where
    T: From<Socket>,
{
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "MultipartSink")
    }
}

impl<T> fmt::Display for MultipartSink<T>
where
    T: From<Socket>,
{
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "MultipartSink")
    }
}
