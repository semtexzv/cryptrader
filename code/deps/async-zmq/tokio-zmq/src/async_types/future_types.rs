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

//! This module contains definitions for `RequestFuture` and `ResponseFuture`, the two types that
//! implement `futures::Future`.

use std::mem;

use async_zmq_types::Multipart;
use futures::{task::current, Async};
use log::debug;
use mio::Ready;
use zmq::{self, Message, DONTWAIT, POLLIN, POLLOUT, SNDMORE};

use crate::{
    async_types::{EventedFile, MsgPlace},
    error::Error,
};

/*-------------------------------RequestFuture--------------------------------*/

pub(crate) struct RequestFuture;

impl RequestFuture {
    fn send(
        &mut self,
        sock: &zmq::Socket,
        multipart: &mut Multipart,
    ) -> Result<Async<()>, Error> {
        while let Some(msg) = multipart.pop_front() {
            let place = if multipart.is_empty() {
                MsgPlace::Last
            } else {
                MsgPlace::Nth
            };

            debug!("RequestFuture: sending: {:?}", msg.as_str());
            match self.send_msg(sock, msg, &place)? {
                None => {
                    if multipart.is_empty() {
                        break;
                    }
                }
                Some(msg) => {
                    multipart.push_front(msg);
                    return Ok(Async::NotReady);
                }
            }
        }

        Ok(Async::Ready(()))
    }

    fn send_msg(
        &mut self,
        sock: &zmq::Socket,
        msg: Message,
        place: &MsgPlace,
    ) -> Result<Option<Message>, Error> {
        let flags = DONTWAIT | if *place == MsgPlace::Last { 0 } else { SNDMORE };

        let msg_clone = Message::from_slice(&msg);

        match sock.send(msg, flags) {
            Ok(_) => Ok(None),
            Err(zmq::Error::EAGAIN) => {
                // return message in future
                debug!("RequestFuture: EAGAIN");
                Ok(Some(msg_clone))
            }
            Err(e) => Err(e.into()),
        }
    }

    fn check_write(&mut self, sock: &zmq::Socket, file: &EventedFile) -> Result<bool, Error> {
        if let Async::NotReady = file.poll_write_ready()? {
            // Get the events currently waiting on the socket
            let events = sock.get_events()?;
            if (events & POLLOUT) != POLLOUT {
                return Ok(false);
            }
        }

        current().notify();
        file.clear_write_ready()?;
        Ok(true)
    }

    pub(crate) fn poll(
        &mut self,
        sock: &zmq::Socket,
        file: &EventedFile,
        multipart: &mut Multipart,
    ) -> Result<Async<()>, Error> {
        if let Async::Ready(_) = file.poll_read_ready(Ready::readable())? {
            current().notify();
            file.clear_read_ready(Ready::readable())?;
        }

        if self.check_write(sock, file)? {
            self.send(sock, multipart)
        } else {
            Ok(Async::NotReady)
        }
    }
}

/*-------------------------------ResponseFuture-------------------------------*/

pub(crate) struct ResponseFuture;

impl ResponseFuture {
    fn recv(
        &mut self,
        sock: &zmq::Socket,
        multipart: &mut Multipart,
    ) -> Result<Async<Multipart>, Error> {
        let mut first = true;

        loop {
            match self.recv_msg(sock)? {
                Async::Ready(msg) => {
                    first = false;
                    let more = msg.get_more();

                    multipart.push_back(msg);

                    if !more {
                        return Ok(Async::Ready(mem::replace(multipart, Multipart::new())));
                    }
                }
                Async::NotReady => {
                    if first {
                        return Ok(Async::NotReady);
                    }
                }
            }
        }
    }

    fn recv_msg(&mut self, sock: &zmq::Socket) -> Result<Async<Message>, Error> {
        let mut msg = Message::new();

        match sock.recv(&mut msg, DONTWAIT) {
            Ok(_) => {
                debug!("ResponseFuture: received: {:?}", msg.as_str());
                Ok(Async::Ready(msg))
            }
            Err(zmq::Error::EAGAIN) => {
                debug!("ResponseFuture: EAGAIN");
                Ok(Async::NotReady)
            }
            Err(e) => Err(e.into()),
        }
    }

    fn check_read(&mut self, sock: &zmq::Socket, file: &EventedFile) -> Result<bool, Error> {
        if let Async::NotReady = file.poll_read_ready(Ready::readable())? {
            let events = sock.get_events()?;
            if (events & POLLIN) != POLLIN {
                return Ok(false);
            }
        }

        current().notify();
        file.clear_read_ready(Ready::readable())?;
        Ok(true)
    }

    pub(crate) fn poll(
        &mut self,
        sock: &zmq::Socket,
        file: &EventedFile,
        multipart: &mut Multipart,
    ) -> Result<Async<Multipart>, Error> {
        if let Async::Ready(_) = file.poll_write_ready()? {
            current().notify();
            file.clear_write_ready()?;
        }

        if self.check_read(sock, file)? {
            self.recv(sock, multipart)
        } else {
            Ok(Async::NotReady)
        }
    }
}
