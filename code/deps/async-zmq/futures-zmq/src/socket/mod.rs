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

//! This module contains useful types for working with ZeroMQ Sockets.

pub mod config;
pub mod types;

use std::{fmt, sync::Arc};

use async_zmq_types::{InnerSocket, IntoInnerSocket, Multipart, SocketBuilder};
use zmq;

use crate::{
    async_types::{
        MultipartRequest, MultipartResponse, MultipartSink, MultipartSinkStream, MultipartStream,
    },
    polling::{LocalSession, SockId},
};

/// Defines the raw Socket type. This type should never be interacted with directly, except to
/// create new instances of wrapper types.
pub struct Socket {
    sock: SockId,
    session: LocalSession,
}

impl Socket {
    /// Start a new Socket Config builder
    pub fn builder<T>(ctx: Arc<zmq::Context>) -> SocketBuilder<'static, T>
    where
        T: IntoInnerSocket,
    {
        SocketBuilder::new(ctx)
    }

    /// Retrieve a Reference-Counted Pointer to self's socket.
    pub fn inner(self) -> SockId {
        self.sock
    }

    /// Create a new socket from a given Sock and File
    ///
    /// This assumes that `sock` is already configured properly. Please don't call this directly
    /// unless you know what you're doing.
    pub fn from_sock_and_session(sock: SockId, session: LocalSession) -> Self {
        Socket { sock, session }
    }
}

impl<T> InnerSocket<T> for Socket
where
    T: IntoInnerSocket + From<Self>,
{
    type Request = MultipartRequest<T>;
    type Response = MultipartResponse<T>;

    type Sink = MultipartSink<T>;
    type Stream = MultipartStream<T>;

    type SinkStream = MultipartSinkStream<T>;

    fn send(self, multipart: Multipart) -> Self::Request {
        MultipartRequest::new(self.session, self.sock, multipart)
    }

    fn recv(self) -> Self::Response {
        MultipartResponse::new(self.session, self.sock)
    }

    fn stream(self) -> Self::Stream {
        MultipartStream::new(self.session, self.sock)
    }

    fn sink(self, buffer_size: usize) -> Self::Sink {
        MultipartSink::new(self.session, self.sock, buffer_size)
    }

    fn sink_stream(self, buffer_size: usize) -> Self::SinkStream {
        MultipartSinkStream::new(self.session, self.sock, buffer_size)
    }
}

impl From<(SockId, LocalSession)> for Socket {
    fn from((sock, session): (SockId, LocalSession)) -> Self {
        Socket { sock, session }
    }
}

impl fmt::Debug for Socket {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "Socket({:?})", self.sock)
    }
}

impl fmt::Display for Socket {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "Socket({})", self.sock)
    }
}
