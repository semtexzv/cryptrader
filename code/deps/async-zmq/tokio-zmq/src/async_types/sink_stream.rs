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

//! This module defines the `MultipartSinkStream` type. A wrapper around Sockets that implements
//! `futures::Sink` and `futures::Stream`.

use std::{fmt, marker::PhantomData, mem};

use async_zmq_types::{IntoSocket, Multipart};
use futures::{Async, AsyncSink, Sink, Stream};
use log::{debug, error};
use zmq;

use crate::{
    async_types::{sink_type::SinkType, stream_type::StreamType, EventedFile},
    error::Error,
    socket::Socket,
};

enum SinkStreamState {
    Sink(SinkType),
    Stream(StreamType),
    Both(SinkType, StreamType),
    Ready,
    Polling,
}

/// The `MultipartSinkStream` handles sending and receiving streams of data to and from ZeroMQ
/// Sockets.
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
/// use futures::{Future, Sink, Stream};
/// use tokio_zmq::{prelude::*, Error, Multipart, Rep, Socket};
///
/// fn main() {
///     let context = Arc::new(zmq::Context::new());
///     let fut = Rep::builder(context)
///         .bind("tcp://*:5575")
///         .build()
///         .and_then(|rep| {
///             let sink_stream = rep.sink_stream(25);
///
///             let (sink, stream) = sink_stream.split();
///
///             stream.forward(sink)
///         });
///
///     // tokio::run(fut.map(|_| ()).map_err(|_| ()));
/// }
/// ```
pub struct MultipartSinkStream<T>
where
    T: From<Socket>,
{
    sock: zmq::Socket,
    file: EventedFile,
    inner: SinkStreamState,
    buffer_size: usize,
    phantom: PhantomData<T>,
}

impl<T> MultipartSinkStream<T>
where
    T: From<Socket>,
{
    pub fn new(buffer_size: usize, sock: zmq::Socket, file: EventedFile) -> Self {
        MultipartSinkStream {
            sock: sock,
            file: file,
            inner: SinkStreamState::Ready,
            buffer_size,
            phantom: PhantomData,
        }
    }

    fn polling(&mut self) -> SinkStreamState {
        mem::replace(&mut self.inner, SinkStreamState::Polling)
    }

    fn poll_sink(
        &mut self,
        mut sink: SinkType,
        stream: Option<StreamType>,
    ) -> Result<Async<()>, Error> {
        match sink.poll_complete(&self.sock, &self.file)? {
            Async::Ready(_) => {
                match stream {
                    Some(stream) => self.inner = SinkStreamState::Stream(stream),
                    None => self.inner = SinkStreamState::Ready,
                }
                Ok(Async::Ready(()))
            }
            Async::NotReady => {
                match stream {
                    Some(stream) => {
                        self.inner = SinkStreamState::Both(sink, stream);
                    }
                    None => {
                        self.inner = SinkStreamState::Sink(sink);
                    }
                }

                Ok(Async::NotReady)
            }
        }
    }

    fn poll_stream(
        &mut self,
        mut stream: StreamType,
        sink: Option<SinkType>,
    ) -> Result<Async<Option<Multipart>>, Error> {
        match stream.poll(&self.sock, &self.file)? {
            Async::Ready(item) => {
                match sink {
                    Some(sink) => self.inner = SinkStreamState::Sink(sink),
                    None => self.inner = SinkStreamState::Ready,
                }
                Ok(Async::Ready(item))
            }
            Async::NotReady => {
                match sink {
                    Some(sink) => self.inner = SinkStreamState::Both(sink, stream),
                    None => self.inner = SinkStreamState::Stream(stream),
                }

                Ok(Async::NotReady)
            }
        }
    }
}

impl<T> IntoSocket<T, Socket> for MultipartSinkStream<T>
where
    T: From<Socket>,
{
    fn into_socket(self) -> T {
        T::from(Socket::from_sock_and_file(self.sock, self.file))
    }
}

impl<T> Sink for MultipartSinkStream<T>
where
    T: From<Socket>,
{
    type SinkItem = Multipart;
    type SinkError = Error;

    fn start_send(
        &mut self,
        multipart: Self::SinkItem,
    ) -> Result<AsyncSink<Self::SinkItem>, Self::SinkError> {
        debug!("Called start_send");
        match self.polling() {
            SinkStreamState::Ready => {
                let mut sink = SinkType::new(self.buffer_size);
                sink.start_send(multipart, &self.sock, &self.file)?;
                self.inner = SinkStreamState::Sink(sink);
                debug!("Created sink");
                Ok(AsyncSink::Ready)
            }
            SinkStreamState::Sink(mut sink) => {
                sink.start_send(multipart, &self.sock, &self.file)?;
                self.inner = SinkStreamState::Sink(sink);
                Ok(AsyncSink::Ready)
            }
            SinkStreamState::Stream(stream) => {
                let mut sink = SinkType::new(self.buffer_size);
                sink.start_send(multipart, &self.sock, &self.file)?;
                self.inner = SinkStreamState::Both(sink, stream);
                debug!("Created sink");
                Ok(AsyncSink::Ready)
            }
            SinkStreamState::Both(mut sink, stream) => {
                sink.start_send(multipart, &self.sock, &self.file)?;
                self.inner = SinkStreamState::Both(sink, stream);
                Ok(AsyncSink::Ready)
            }
            SinkStreamState::Polling => {
                error!("start_send, Cannot start send while polling");
                Err(Error::Sink)
            }
        }
    }

    fn poll_complete(&mut self) -> Result<Async<()>, Self::SinkError> {
        debug!("Called poll_complete");
        match self.polling() {
            SinkStreamState::Ready => {
                self.inner = SinkStreamState::Ready;
                Ok(Async::Ready(()))
            }
            SinkStreamState::Sink(sink) => self.poll_sink(sink, None),
            SinkStreamState::Stream(stream) => {
                self.inner = SinkStreamState::Stream(stream);
                Ok(Async::Ready(()))
            }
            SinkStreamState::Both(sink, stream) => self.poll_sink(sink, Some(stream)),
            SinkStreamState::Polling => Err(Error::Sink),
        }
    }
}

impl<T> Stream for MultipartSinkStream<T>
where
    T: From<Socket>,
{
    type Item = Multipart;
    type Error = Error;

    fn poll(&mut self) -> Result<Async<Option<Multipart>>, Self::Error> {
        match self.polling() {
            SinkStreamState::Ready => self.poll_stream(StreamType::new(), None),
            SinkStreamState::Sink(sink) => self.poll_stream(StreamType::new(), Some(sink)),
            SinkStreamState::Both(sink, stream) => self.poll_stream(stream, Some(sink)),
            SinkStreamState::Stream(stream) => self.poll_stream(stream, None),
            SinkStreamState::Polling => Err(Error::Stream),
        }
    }
}

impl<T> fmt::Debug for MultipartSinkStream<T>
where
    T: From<Socket>,
{
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "MultipartSinkStream")
    }
}

impl<T> fmt::Display for MultipartSinkStream<T>
where
    T: From<Socket>,
{
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "MultipartSinkStream")
    }
}
