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

use std::{fmt, marker::PhantomData, mem};

use async_zmq_types::{IntoSocket, Multipart};
use futures::{Async, Stream};
use log::{error, trace};

use crate::{
    async_types::RecvState,
    error::Error,
    polling::{LocalSession, SockId},
    socket::Socket,
};

pub(crate) enum StreamState {
    Pending,
    Running(RecvState),
    Polling,
}

impl StreamState {
    fn polling(&mut self) -> StreamState {
        mem::replace(self, StreamState::Polling)
    }

    fn poll_fut(
        &mut self,
        session: &LocalSession,
        sock: &SockId,
        mut fut: RecvState,
    ) -> Result<Async<Option<Multipart>>, Error> {
        match fut.poll_fetch(session, sock)? {
            Async::Ready(msg) => {
                *self = StreamState::Pending;
                Ok(Async::Ready(Some(msg)))
            }
            Async::NotReady => {
                *self = StreamState::Running(fut);
                Ok(Async::NotReady)
            }
        }
    }

    pub(crate) fn poll_fetch(
        &mut self,
        session: &LocalSession,
        sock: &SockId,
    ) -> Result<Async<Option<Multipart>>, Error> {
        match self.polling() {
            StreamState::Pending => self.poll_fut(session, sock, RecvState::Pending),
            StreamState::Running(fut) => self.poll_fut(session, sock, fut),
            StreamState::Polling => {
                error!("Called polling while polling");
                return Err(Error::Polling);
            }
        }
    }
}

pub struct MultipartStream<T>
where
    T: From<Socket>,
{
    state: StreamState,
    session: LocalSession,
    sock: SockId,
    phantom: PhantomData<T>,
}

impl<T> MultipartStream<T>
where
    T: From<Socket>,
{
    pub fn new(session: LocalSession, sock: SockId) -> Self {
        MultipartStream {
            state: StreamState::Pending,
            session,
            sock,
            phantom: PhantomData,
        }
    }
}

impl<T> IntoSocket<T, Socket> for MultipartStream<T>
where
    T: From<Socket>,
{
    fn into_socket(self) -> T {
        T::from(Socket::from_sock_and_session(self.sock, self.session))
    }
}

impl<T> Stream for MultipartStream<T>
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

impl<T> fmt::Debug for MultipartStream<T>
where
    T: From<Socket>,
{
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "MultipartStream({:?})", self.sock)
    }
}

impl<T> fmt::Display for MultipartStream<T>
where
    T: From<Socket>,
{
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "MultipartStream({})", self.sock)
    }
}
