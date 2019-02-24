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

use std::{collections::VecDeque, fmt, marker::PhantomData, mem};

use async_zmq_types::{IntoSocket, Multipart};
use futures::{Async, AsyncSink, Sink};
use log::error;

use crate::{
    async_types::SendState,
    error::Error,
    polling::{LocalSession, SockId},
    socket::Socket,
};

pub(crate) enum SinkState {
    Pending,
    Running(SendState),
    Polling,
}

impl SinkState {
    fn polling(&mut self) -> SinkState {
        mem::replace(self, SinkState::Polling)
    }

    fn poll_fut(
        &mut self,
        mut fut: SendState,
        session: &LocalSession,
        sock: &SockId,
    ) -> Result<Async<()>, Error> {
        match fut.poll_flush(session, sock)? {
            Async::Ready(_) => {
                *self = SinkState::Pending;
                Ok(Async::Ready(()))
            }
            Async::NotReady => {
                *self = SinkState::Running(fut);
                Ok(Async::NotReady)
            }
        }
    }

    pub(crate) fn poll_flush(
        &mut self,
        session: &LocalSession,
        sock: &SockId,
        multiparts: &mut VecDeque<Multipart>,
    ) -> Result<Async<()>, Error> {
        match self.polling() {
            SinkState::Pending => {
                if let Some(multipart) = multiparts.pop_front() {
                    if let Async::Ready(_) =
                        self.poll_fut(SendState::Pending(multipart), session, sock)?
                    {
                        self.poll_flush(session, sock, multiparts)
                    } else {
                        Ok(Async::NotReady)
                    }
                } else {
                    *self = SinkState::Pending;
                    Ok(Async::Ready(()))
                }
            }
            SinkState::Running(fut) => {
                if let Async::Ready(_) = self.poll_fut(fut, session, sock)? {
                    self.poll_flush(session, sock, multiparts)
                } else {
                    Ok(Async::NotReady)
                }
            }
            SinkState::Polling => {
                error!("Called polling while polling");
                return Err(Error::Polling);
            }
        }
    }

    pub(crate) fn start_send(
        &mut self,
        session: &LocalSession,
        sock: &SockId,
        multiparts: &mut VecDeque<Multipart>,
        buffer_size: usize,
        multipart: Multipart,
    ) -> Result<AsyncSink<Multipart>, Error> {
        if multiparts.len() >= buffer_size {
            if let Async::NotReady = self.poll_flush(session, sock, multiparts)? {
                if multiparts.len() >= 1 {
                    return Ok(AsyncSink::NotReady(multipart));
                }
            }
        }

        multiparts.push_back(multipart);
        Ok(AsyncSink::Ready)
    }
}

pub struct MultipartSink<T>
where
    T: From<Socket>,
{
    state: SinkState,
    session: LocalSession,
    sock: SockId,
    multiparts: VecDeque<Multipart>,
    buffer_size: usize,
    phantom: PhantomData<T>,
}

impl<T> MultipartSink<T>
where
    T: From<Socket>,
{
    pub fn new(session: LocalSession, sock: SockId, buffer_size: usize) -> Self {
        MultipartSink {
            state: SinkState::Pending,
            session,
            sock,
            multiparts: VecDeque::new(),
            buffer_size,
            phantom: PhantomData,
        }
    }
}

impl<T> IntoSocket<T, Socket> for MultipartSink<T>
where
    T: From<Socket>,
{
    fn into_socket(self) -> T {
        T::from(Socket::from_sock_and_session(self.sock, self.session))
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

impl<T> fmt::Debug for MultipartSink<T>
where
    T: From<Socket>,
{
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "MultipartSink({:?})", self.sock)
    }
}

impl<T> fmt::Display for MultipartSink<T>
where
    T: From<Socket>,
{
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "MultipartSink({})", self.sock)
    }
}
