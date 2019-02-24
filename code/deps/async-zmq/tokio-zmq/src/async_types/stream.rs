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

use std::{
    fmt,
    marker::PhantomData,
    time::{Duration, Instant},
};

use async_zmq_types::{IntoSocket, Multipart};
use futures::{future::Either, Async, Future, Stream};
use tokio_timer::Delay;
use zmq;

pub use async_zmq_types::{ControlledStream, EndingStream};

use crate::{
    async_types::{stream_type::StreamType, EventedFile},
    error::Error,
    socket::Socket,
};

/// The `MultipartStream` Sink handles receiving streams of data from ZeroMQ Sockets.
///
/// You shouldn't ever need to manually create one. Here's how to get one from a 'raw' `Socket`'
/// type.
///
/// ### Example
/// ```rust
/// extern crate zmq;
/// extern crate futures;
/// extern crate tokio_zmq;
///
/// use std::sync::Arc;
///
/// use futures::{Future, Stream};
/// use tokio_zmq::{async_types::MultipartStream, prelude::*, Error, Multipart, Socket, Sub};
///
/// fn main() {
///     let context = Arc::new(zmq::Context::new());
///     let fut = Sub::builder(context)
///         .connect("tcp://localhost:5568")
///         .filter(b"")
///         .build()
///         .and_then(|sub| {
///             sub.stream()
///                 .and_then(|multipart| {
///                     // handle multipart
///                     Ok(multipart)
///                 })
///                 .for_each(|_| Ok(()))
///         });
/// }
/// ```
pub struct MultipartStream<T>
where
    T: From<Socket>,
{
    sock: zmq::Socket,
    file: EventedFile,
    inner: StreamType,
    phantom: PhantomData<T>,
}

impl<T> MultipartStream<T>
where
    T: From<Socket>,
{
    pub fn new(sock: zmq::Socket, file: EventedFile) -> Self {
        MultipartStream {
            sock,
            file,
            inner: StreamType::new(),
            phantom: PhantomData,
        }
    }
}

impl<T> IntoSocket<T, Socket> for MultipartStream<T>
where
    T: From<Socket>,
{
    fn into_socket(self) -> T {
        T::from(Socket::from_sock_and_file(self.sock, self.file))
    }
}

impl<T> Stream for MultipartStream<T>
where
    T: From<Socket>,
{
    type Item = Multipart;
    type Error = Error;

    fn poll(&mut self) -> Result<Async<Option<Multipart>>, Self::Error> {
        self.inner.poll(&self.sock, &self.file)
    }
}

impl<T> fmt::Debug for MultipartStream<T>
where
    T: From<Socket>,
{
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "MultipartStream")
    }
}

impl<T> fmt::Display for MultipartStream<T>
where
    T: From<Socket>,
{
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "MultipartStream")
    }
}

/// An empty type to represent a timeout event
pub struct Timeout;

/// A stream that provides either an `Item` or a `Timeout`
///
/// This is different from `tokio_timer::TimeoutStream<T>`, since that stream errors on timeout.
pub struct TimeoutStream<S>
where
    S: Stream,
{
    stream: S,
    duration: Duration,
    timeout: Delay,
}

impl<S> TimeoutStream<S>
where
    S: Stream<Error = Error>,
{
    /// Add a timeout to a stream
    pub fn new(stream: S, duration: Duration) -> Self {
        let timeout = Delay::new(Instant::now() + duration);

        TimeoutStream {
            stream,
            duration,
            timeout,
        }
    }
}

impl<S> Stream for TimeoutStream<S>
where
    S: Stream<Error = Error>,
{
    type Item = Either<S::Item, Timeout>;
    type Error = Error;

    fn poll(&mut self) -> Result<Async<Option<Self::Item>>, Self::Error> {
        if let Async::Ready(_) = self.timeout.poll()? {
            self.timeout = Delay::new(Instant::now() + self.duration);

            return Ok(Async::Ready(Some(Either::B(Timeout))));
        }

        let res = match self.stream.poll()? {
            Async::Ready(Some(item)) => Async::Ready(Some(Either::A(item))),
            Async::Ready(None) => Async::Ready(None),
            Async::NotReady => Async::NotReady,
        };

        Ok(res)
    }
}
