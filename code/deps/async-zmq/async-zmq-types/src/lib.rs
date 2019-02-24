/*
 * This file is part of Async ZMQ Types.
 *
 * Copyright © 2018 Riley Trautman
 *
 * Async ZMQ Types is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Async ZMQ Types is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Async ZMQ Types.  If not, see <http://www.gnu.org/licenses/>.
 */

//! Provide useful types and traits for working with ZMQ Asynchronously.

use std::sync::Arc;

use futures::{Future, Sink, Stream};

mod config;
mod message;
mod stream;

pub use crate::{
    config::{PairConfig, SockConfig, SocketBuilder, SubConfig},
    message::Multipart,
    stream::{ControlledStream, EndingStream},
};

/* ----------------------------------TYPES----------------------------------- */

/* ----------------------------------TRAITS---------------------------------- */

pub trait IntoSocket<T, U>: Sized
where
    T: From<U>,
{
    fn into_socket(self) -> T;
}

/// Define all actions possible on a socket
///
/// This should be generic enough to implement over any executor. On Tokio, this might consist of
/// a Socket with an EventedFd, on Futures, it might just be a Socket.
pub trait InnerSocket<T>: Sized
where
    T: IntoInnerSocket + From<Self>,
{
    /// The future that sends a multipart to a ZMQ socket
    type Request: Future<Item = T>;

    /// The future that receives a multipart from a ZMQ socket
    type Response: Future<Item = (Multipart, T)>;

    /// A Stream of multiparts received from a ZMQ socket
    type Stream: Stream<Item = Multipart> + IntoSocket<T, Self>;

    /// A Sink that sends multiparts to a ZMQ socket
    type Sink: Sink<SinkItem = Multipart> + IntoSocket<T, Self>;

    /// A Sink and Stream that sends and receives multiparts from a ZMQ socket
    type SinkStream: Stream<Item = Multipart> + Sink<SinkItem = Multipart> + IntoSocket<T, Self>;

    fn send(self, multipart: Multipart) -> Self::Request;

    fn recv(self) -> Self::Response;

    fn stream(self) -> Self::Stream;

    fn sink(self, buffer_size: usize) -> Self::Sink;

    fn sink_stream(self, buffer_size: usize) -> Self::SinkStream;
}

/// The `IntoInnerSocket` trait is implemented for all wrapper types. This makes implementing other traits a
/// matter of saying a given type implements them.
pub trait IntoInnerSocket: Sized
where
    Self: From<<Self as IntoInnerSocket>::Socket>,
{
    type Socket: InnerSocket<Self>;

    /// Any type implementing `IntoInnerSocket` must have a way of returning an InnerSocket.
    fn socket(self) -> Self::Socket;

    fn kind() -> zmq::SocketType;
}

/// The `ControlHandler` trait is used to impose stopping rules for streams that otherwise would
/// continue to create multiparts.
pub trait ControlHandler {
    /// `should_stop` determines whether or not a `ControlledStream` should stop producing values.
    ///
    /// It accepts a Multipart as input. This Multipart comes from the ControlledStream's
    /// associated control MultipartStream. If you want to have a socket that stops based on the
    /// content of a message it receives, see the `EndHandler` trait.
    fn should_stop(&mut self, multipart: Multipart) -> bool;
}

/// The `EndHandler` trait is used to impose stopping rules for streams that otherwise would
/// continue to create multiparts.
pub trait EndHandler {
    /// `should_stop` determines whether or not a `StreamSocket` should stop producing values.
    ///
    /// This method should be used if the stop signal sent to a given socket will be in-line with
    /// the rest of the messages that socket receives. If you want to have a socket controlled by
    /// another socket, see the `ControlHandler` trait.
    fn should_stop(&mut self, multipart: &Multipart) -> bool;
}

/// This trait provides the basic Stream support for ZeroMQ Sockets. It depends on `IntoInnerSocket`, but
/// provides implementations for `sink` and `recv`.
pub trait StreamSocket: IntoInnerSocket {
    /// Receive a single multipart message from the socket.
    ///
    /// ### Example, using the Rep wrapper type
    /// ```rust
    /// extern crate futures;
    /// extern crate tokio;
    /// extern crate tokio_zmq;
    /// extern crate zmq;
    ///
    /// use std::sync::Arc;
    ///
    /// use futures::Future;
    /// use tokio_zmq::{prelude::*, async_types::MultipartStream, Error, Multipart, Rep};
    ///
    /// fn main() {
    ///     let context = Arc::new(zmq::Context::new());
    ///
    ///     let fut = Rep::builder(context)
    ///         .connect("tcp://localhost:5568")
    ///         .build()
    ///         .and_then(|rep| {
    ///             rep.recv().and_then(|(multipart, _)| {
    ///                 for msg in &multipart {
    ///                     if let Some(msg) = msg.as_str() {
    ///                         println!("Message: {}", msg);
    ///                     }
    ///                 }
    ///                 Ok(multipart)
    ///             })
    ///         });
    ///
    ///     // tokio::run(fut.map(|_| ()).or_else(|e| {
    ///     //     println!("Error: {}", e);
    ///     //     Ok(())
    ///     // }));
    ///     # let _ = fut;
    /// }
    /// ```
    fn recv(self) -> <<Self as IntoInnerSocket>::Socket as InnerSocket<Self>>::Response {
        self.socket().recv()
    }

    /// Receive a stream of multipart messages from the socket.
    ///
    /// ### Example, using a Sub wrapper type
    /// ```rust
    /// extern crate zmq;
    /// extern crate futures;
    /// extern crate tokio;
    /// extern crate tokio_zmq;
    ///
    /// use std::sync::Arc;
    ///
    /// use futures::{Future, Stream};
    /// use tokio_zmq::{prelude::*, async_types::MultipartStream, Error, Multipart, Sub};
    ///
    /// fn main() {
    ///     let context = Arc::new(zmq::Context::new());
    ///     let fut = Sub::builder(context)
    ///         .connect("tcp://localhost:5569")
    ///         .filter(b"")
    ///         .build()
    ///         .and_then(|sub| {
    ///             sub.stream().for_each(|multipart| {
    ///                 for msg in multipart {
    ///                     if let Some(msg) = msg.as_str() {
    ///                         println!("Message: {}", msg);
    ///                     }
    ///                 }
    ///                 Ok(())
    ///             })
    ///         });
    ///
    ///     // tokio::run(fut.map(|_| ()).or_else(|e| {
    ///     //     println!("Error: {}", e);
    ///     //     Ok(())
    ///     // }));
    /// }
    /// ```
    fn stream(self) -> <<Self as IntoInnerSocket>::Socket as InnerSocket<Self>>::Stream {
        self.socket().stream()
    }
}

/// This trait provides the basic Sink support for ZeroMQ Sockets. It depends on `IntoInnerSocket` and
/// provides the `send` and `sink` methods.
pub trait SinkSocket: IntoInnerSocket {
    /// Send a single multipart message to the socket.
    ///
    /// ### Example, using a Pub wrapper type
    /// ```rust
    /// extern crate zmq;
    /// extern crate futures;
    /// extern crate tokio;
    /// extern crate tokio_zmq;
    ///
    /// use std::sync::Arc;
    ///
    /// use futures::Future;
    /// use tokio_zmq::{prelude::*, async_types::MultipartStream, Error, Pub};
    ///
    /// fn main() {
    ///     let context = Arc::new(zmq::Context::new());
    ///     let msg = zmq::Message::from_slice(b"Hello");
    ///     let fut = Pub::builder(context)
    ///         .connect("tcp://localhost:5569")
    ///         .build()
    ///         .and_then(|zpub| zpub.send(msg.into()));
    ///
    ///     // tokio::run(fut.map(|_| ()).or_else(|e| {
    ///     //     println!("Error: {}", e);
    ///     //     Ok(())
    ///     // }));
    /// }
    /// ```
    fn send(
        self,
        multipart: Multipart,
    ) -> <<Self as IntoInnerSocket>::Socket as InnerSocket<Self>>::Request {
        self.socket().send(multipart)
    }

    /// Send a stream of multipart messages to the socket.
    ///
    /// It takes a buffer_size argument, which will determine how many `Multipart`s can be
    /// submitted into the send queue before the sink applies backpressure.
    ///
    /// ### Example, using a Pub wrapper type
    /// ```rust
    /// extern crate zmq;
    /// extern crate futures;
    /// extern crate tokio;
    /// extern crate tokio_zmq;
    ///
    /// use std::sync::Arc;
    ///
    /// use futures::{Future, Stream, stream::iter_ok};
    /// use tokio_zmq::{prelude::*, async_types::MultipartStream, Error, Multipart, Pub};
    ///
    /// fn main() {
    ///     let context = Arc::new(zmq::Context::new());
    ///     let fut = Pub::builder(context)
    ///         .connect("tcp://localhost:5570")
    ///         .build()
    ///         .and_then(|zpub| {
    ///             iter_ok(0..5)
    ///                 .map(|i| {
    ///                     zmq::Message::from_slice(format!("i: {}", i).as_bytes()).into()
    ///                 })
    ///                 .forward(zpub.sink(25))
    ///         });
    ///
    ///     // tokio::run(fut.map(|_| ()).or_else(|e| {
    ///     //     println!("Error: {}", e);
    ///     //     Ok(())
    ///     // }));
    /// }
    /// ```
    fn sink(
        self,
        buffer_size: usize,
    ) -> <<Self as IntoInnerSocket>::Socket as InnerSocket<Self>>::Sink {
        self.socket().sink(buffer_size)
    }
}

/// This trait is provided for sockets that implement both Sync and Stream
pub trait SinkStreamSocket: IntoInnerSocket {
    /// Retrieve a structure that implements both Sync and Stream.
    ///
    /// It takes a buffer_size argument, which will determine how many `Multipart`s can be
    /// submitted into the send queue before the sink applies backpressure.
    ///
    /// ### Example, using a Rep wrapper type
    /// ```rust
    /// extern crate futures;
    /// extern crate tokio_zmq;
    /// extern crate zmq;
    ///
    /// use std::sync::Arc;
    ///
    /// use futures::{Future, Stream};
    /// use tokio_zmq::{prelude::*, Rep};
    ///
    /// fn main() {
    ///     let ctx = Arc::new(zmq::Context::new());
    ///     let fut = Rep::builder(ctx)
    ///         .bind("tcp://*:5571")
    ///         .build()
    ///         .and_then(|rep| {
    ///             let (sink, stream) = rep.sink_stream(25).split();
    ///
    ///             stream.forward(sink)
    ///         });
    ///
    ///     // tokio::run(fut.map(|_| ()).or_else(|e| {
    ///     //     println!("Error: {}", e);
    ///     //     Ok(())
    ///     // }));
    /// }
    /// ```
    fn sink_stream(
        self,
        buffer_size: usize,
    ) -> <<Self as IntoInnerSocket>::Socket as InnerSocket<Self>>::SinkStream;
}

/// This trait is provided to allow for ending a stream based on a Multipart message it receives.
pub trait WithEndHandler: Stream<Item = Multipart> + Sized {
    /// Add an EndHandler to a stream.
    ///
    /// ### Example, using a Sub wrapper type
    /// ```rust
    /// extern crate futures;
    /// extern crate tokio_zmq;
    /// extern crate zmq;
    ///
    /// use std::sync::Arc;
    ///
    /// use futures::{Future, Stream};
    /// use tokio_zmq::{prelude::*, Sub, Multipart};
    ///
    /// struct End(u32);
    ///
    /// impl EndHandler for End {
    ///     fn should_stop(&mut self, multipart: &Multipart) -> bool {
    ///         self.0 += 1;
    ///
    ///         self.0 > 30
    ///     }
    /// }
    ///
    /// fn main() {
    ///     let ctx = Arc::new(zmq::Context::new());
    ///     let fut = Sub::builder(ctx)
    ///         .bind("tcp://*:5571")
    ///         .filter(b"")
    ///         .build()
    ///         .and_then(|sub| {
    ///             sub.stream()
    ///                 .with_end_handler(End(0))
    ///                 .for_each(|_| Ok(()))
    ///         });
    ///
    ///     // tokio::run(fut.map(|_| ()).or_else(|e| {
    ///     //     println!("Error: {}", e);
    ///     //     Ok(())
    ///     // }));
    /// }
    /// ```
    fn with_end_handler<E>(self, end_handler: E) -> EndingStream<E, Self, Self::Error>
    where
        E: EndHandler;
}

/// This trait is implemented by all Streams with Item = Multipart and Error = Error, it provides
/// the ability to control when the stream stops based on the content of another stream.
pub trait Controllable: Stream<Item = Multipart> + Sized {
    /// Add a controller stream to a given stream. This allows the controller stream to decide when
    /// the controlled stream should stop.
    ///
    /// ### Example, using a controlled Pull wrapper type and a controller Sub wrapper type
    /// ```rust
    /// extern crate futures;
    /// extern crate tokio_zmq;
    /// extern crate zmq;
    ///
    /// use std::sync::Arc;
    ///
    /// use futures::{Future, Stream};
    /// use tokio_zmq::{prelude::*, Pull, Sub, Multipart};
    ///
    /// struct End;
    ///
    /// impl ControlHandler for End {
    ///     fn should_stop(&mut self, _: Multipart) -> bool {
    ///         true
    ///     }
    /// }
    ///
    /// fn main() {
    ///     let ctx = Arc::new(zmq::Context::new());
    ///     let init_pull = Pull::builder(Arc::clone(&ctx))
    ///         .bind("tcp://*:5572")
    ///         .build();
    ///
    ///     let init_sub = Sub::builder(ctx)
    ///         .bind("tcp://*:5573")
    ///         .filter(b"")
    ///         .build();
    ///
    ///     let fut = init_pull
    ///         .join(init_sub)
    ///         .and_then(|(pull, sub)| {
    ///             pull.stream()
    ///                 .controlled(sub.stream(), End)
    ///                 .for_each(|_| Ok(()))
    ///         });
    ///
    ///     // tokio::run(fut.map(|_| ()).or_else(|e| {
    ///     //     println!("Error: {}", e);
    ///     //     Ok(())
    ///     // }));
    /// }
    /// ```
    fn controlled<H, S>(
        self,
        control_stream: S,
        handler: H,
    ) -> ControlledStream<H, S, Self, Self::Error>
    where
        H: ControlHandler,
        S: Stream<Item = Multipart>,
        Self: Stream<Item = Multipart, Error = S::Error>;
}

pub trait UnPair {}
pub trait Pair {}
pub trait Sub {}
pub trait UnSub {}

pub trait Build<T, E> {
    type Result: Future<Item = T, Error = E>;

    fn build(self) -> Self::Result;
}

/// This trait is implemented by all socket types to allow custom builders to be created
pub trait HasBuilder: IntoInnerSocket {
    fn builder(ctx: Arc<zmq::Context>) -> SocketBuilder<'static, Self>
    where
        Self: Sized,
    {
        SocketBuilder::new(ctx)
    }
}

/* ----------------------------------impls----------------------------------- */

impl<T> HasBuilder for T where T: IntoInnerSocket {}

impl<T> SinkStreamSocket for T
where
    T: StreamSocket + SinkSocket,
{
    fn sink_stream(
        self,
        buffer_size: usize,
    ) -> <<Self as IntoInnerSocket>::Socket as InnerSocket<Self>>::SinkStream {
        self.socket().sink_stream(buffer_size)
    }
}

impl<T> WithEndHandler for T
where
    T: Stream<Item = Multipart>,
{
    fn with_end_handler<E>(self, end_handler: E) -> EndingStream<E, Self, Self::Error>
    where
        E: EndHandler,
    {
        EndingStream::new(self, end_handler)
    }
}

impl<T> Controllable for T
where
    T: Stream<Item = Multipart>,
{
    fn controlled<H, S>(
        self,
        control_stream: S,
        handler: H,
    ) -> ControlledStream<H, S, Self, Self::Error>
    where
        H: ControlHandler,
        S: Stream<Item = Multipart, Error = T::Error>,
    {
        ControlledStream::new(self, control_stream, handler)
    }
}
