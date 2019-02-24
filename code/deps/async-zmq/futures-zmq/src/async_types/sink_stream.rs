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

use std::{collections::VecDeque, fmt, marker::PhantomData};

use async_zmq_types::{IntoSocket, Multipart};
use futures::{Async, AsyncSink, Sink, Stream};
use log::trace;

use crate::{
    async_types::{SinkState, StreamState},
    error::Error,
    polling::{LocalSession, SockId},
    socket::Socket,
};

struct SinkStreamState {
    streaming: StreamState,
    sinking: SinkState,
}

impl SinkStreamState {
    fn new() -> Self {
        SinkStreamState {
            streaming: StreamState::Pending,
            sinking: SinkState::Pending,
        }
    }

    fn poll_flush(
        &mut self,
        session: &LocalSession,
        sock: &SockId,
        multiparts: &mut VecDeque<Multipart>,
    ) -> Result<Async<()>, Error> {
        self.sinking.poll_flush(session, sock, multiparts)
    }

    fn poll_fetch(
        &mut self,
        session: &LocalSession,
        sock: &SockId,
    ) -> Result<Async<Option<Multipart>>, Error> {
        self.streaming.poll_fetch(session, sock)
    }

    fn start_send(
        &mut self,
        session: &LocalSession,
        sock: &SockId,
        multiparts: &mut VecDeque<Multipart>,
        buffer_size: usize,
        multipart: Multipart,
    ) -> Result<AsyncSink<Multipart>, Error> {
        self.sinking
            .start_send(session, sock, multiparts, buffer_size, multipart)
    }
}

pub struct MultipartSinkStream<T>
where
    T: From<Socket>,
{
    state: SinkStreamState,
    session: LocalSession,
    sock: SockId,
    multiparts: VecDeque<Multipart>,
    buffer_size: usize,
    phantom: PhantomData<T>,
}

impl<T> MultipartSinkStream<T>
where
    T: From<Socket>,
{
    pub fn new(session: LocalSession, sock: SockId, buffer_size: usize) -> Self {
        MultipartSinkStream {
            state: SinkStreamState::new(),
            session,
            sock,
            multiparts: VecDeque::new(),
            buffer_size,
            phantom: PhantomData,
        }
    }
}

impl<T> IntoSocket<T, Socket> for MultipartSinkStream<T>
where
    T: From<Socket>,
{
    fn into_socket(self) -> T {
        T::from(Socket::from_sock_and_session(self.sock, self.session))
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
        self.state.start_send(
            &self.session,
            &self.sock,
            &mut self.multiparts,
            self.buffer_size,
            multipart,
        )
    }

    fn poll_complete(&mut self) -> Result<Async<()>, Self::SinkError> {
        self.state
            .poll_flush(&self.session, &self.sock, &mut self.multiparts)
    }
}

impl<T> Stream for MultipartSinkStream<T>
where
    T: From<Socket>,
{
    type Item = Multipart;
    type Error = Error;

    fn poll(&mut self) -> Result<Async<Option<Self::Item>>, Self::Error> {
        match self.state.poll_fetch(&self.session, &self.sock) {
            Ok(Async::Ready(Some(multipart))) => {
                for msg in multipart.iter() {
                    if let Some(msg) = msg.as_str() {
                        trace!("Received {} from {}", msg, &self.sock);
                    }
                }
                Ok(Async::Ready(Some(multipart)))
            }
            other => other,
        }
    }
}

impl<T> fmt::Debug for MultipartSinkStream<T>
where
    T: From<Socket>,
{
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "MultipartSinkStream({:?})", self.sock)
    }
}

impl<T> fmt::Display for MultipartSinkStream<T>
where
    T: From<Socket>,
{
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "MultipartSinkStream({})", self.sock)
    }
}
