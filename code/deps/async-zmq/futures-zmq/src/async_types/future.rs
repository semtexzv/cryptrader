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

use async_zmq_types::Multipart;
use futures::{Async, Future};
use log::{error, trace};

use crate::{
    error::Error,
    polling::{LocalSession, SockId},
    socket::Socket,
    RecvFuture, SendFuture,
};

pub(crate) enum SendState {
    Pending(Multipart),
    Running(SendFuture),
    Polling,
}

impl SendState {
    fn polling(&mut self) -> SendState {
        mem::replace(self, SendState::Polling)
    }

    fn poll_fut(&mut self, mut fut: SendFuture) -> Result<Async<()>, Error> {
        if let Async::Ready(opt) = fut.poll()? {
            match opt {
                None => Ok(Async::Ready(())),
                Some(multipart) => {
                    *self = SendState::Pending(multipart);

                    Ok(Async::NotReady)
                }
            }
        } else {
            *self = SendState::Running(fut);

            Ok(Async::NotReady)
        }
    }

    pub(crate) fn poll_flush(
        &mut self,
        session: &LocalSession,
        sock: &SockId,
    ) -> Result<Async<()>, Error> {
        match self.polling() {
            SendState::Pending(multipart) => {
                for msg in multipart.iter() {
                    if let Some(msg) = msg.as_str() {
                        trace!("Sending {} to {}", msg, sock);
                    }
                }
                self.poll_fut(session.send(sock, multipart))
            }
            SendState::Running(fut) => self.poll_fut(fut),
            SendState::Polling => {
                error!("Called polling while polling");
                return Err(Error::Polling);
            }
        }
    }
}

pub struct MultipartRequest<T>
where
    T: From<Socket>,
{
    state: SendState,
    session: Option<LocalSession>,
    sock: Option<SockId>,
    phantom: PhantomData<T>,
}

impl<T> MultipartRequest<T>
where
    T: From<Socket>,
{
    pub fn new(session: LocalSession, sock: SockId, multipart: Multipart) -> Self {
        MultipartRequest {
            state: SendState::Pending(multipart),
            session: Some(session),
            sock: Some(sock),
            phantom: PhantomData,
        }
    }
}

impl<T> Future for MultipartRequest<T>
where
    T: From<Socket>,
{
    type Item = T;
    type Error = Error;

    fn poll(&mut self) -> Result<Async<Self::Item>, Self::Error> {
        let sock = self.sock.take().unwrap();
        let session = self.session.take().unwrap();

        match self.state.poll_flush(&session, &sock)? {
            Async::Ready(_) => {
                let socket = Socket::from_sock_and_session(sock, session);

                Ok(Async::Ready(T::from(socket)))
            }
            Async::NotReady => {
                self.sock = Some(sock);
                self.session = Some(session);

                Ok(Async::NotReady)
            }
        }
    }
}

impl<T> fmt::Debug for MultipartRequest<T>
where
    T: From<Socket>,
{
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "SendFuture({:?})", self.sock)
    }
}

impl<T> fmt::Display for MultipartRequest<T>
where
    T: From<Socket>,
{
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "SendFuture({:?})", self.sock)
    }
}

pub(crate) enum RecvState {
    Pending,
    Running(RecvFuture),
    Polling,
}

impl RecvState {
    fn polling(&mut self) -> RecvState {
        mem::replace(self, RecvState::Polling)
    }

    fn poll_fut(&mut self, mut fut: RecvFuture) -> Result<Async<Multipart>, Error> {
        if let ready @ Async::Ready(_) = fut.poll()? {
            Ok(ready)
        } else {
            *self = RecvState::Running(fut);

            Ok(Async::NotReady)
        }
    }

    pub(crate) fn poll_fetch(
        &mut self,
        session: &LocalSession,
        sock: &SockId,
    ) -> Result<Async<Multipart>, Error> {
        match self.polling() {
            RecvState::Pending => self.poll_fut(session.recv(sock)),
            RecvState::Running(fut) => self.poll_fut(fut),
            RecvState::Polling => {
                error!("Called polling while polling");
                return Err(Error::Polling);
            }
        }
    }
}

pub struct MultipartResponse<T>
where
    T: From<Socket>,
{
    state: RecvState,
    sock: Option<SockId>,
    session: Option<LocalSession>,
    phantom: PhantomData<T>,
}

impl<T> MultipartResponse<T>
where
    T: From<Socket>,
{
    pub fn new(session: LocalSession, sock: SockId) -> Self {
        MultipartResponse {
            state: RecvState::Pending,
            sock: Some(sock),
            session: Some(session),
            phantom: PhantomData,
        }
    }
}

impl<T> Future for MultipartResponse<T>
where
    T: From<Socket>,
{
    type Item = (Multipart, T);
    type Error = Error;

    fn poll(&mut self) -> Result<Async<Self::Item>, Self::Error> {
        let sock = self.sock.take().unwrap();
        let session = self.session.take().unwrap();

        match self.state.poll_fetch(&session, &sock)? {
            Async::Ready(multipart) => {
                for msg in multipart.iter() {
                    if let Some(msg) = msg.as_str() {
                        trace!("Received {} from {}", msg, sock);
                    }
                }
                let socket = Socket::from_sock_and_session(sock, session);

                Ok(Async::Ready((multipart, T::from(socket))))
            }
            Async::NotReady => {
                self.sock = Some(sock);
                self.session = Some(session);

                Ok(Async::NotReady)
            }
        }
    }
}

impl<T> fmt::Debug for MultipartResponse<T>
where
    T: From<Socket>,
{
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "RecvFuture({:?})", self.sock)
    }
}

impl<T> fmt::Display for MultipartResponse<T>
where
    T: From<Socket>,
{
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "RecvFuture({:?})", self.sock)
    }
}
