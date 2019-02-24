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

//! This module defines the `SinkType` type. A wrapper around Sockets that implements
//! `futures::Sink`.

use std::collections::VecDeque;

use async_zmq_types::Multipart;
use futures::{Async, AsyncSink};
use log::error;
use zmq;

use crate::{
    async_types::{future_types::RequestFuture, EventedFile},
    error::Error,
};

pub(crate) struct SinkType {
    buffer_size: usize,
    pending: VecDeque<Multipart>,
}

impl Drop for SinkType {
    fn drop(&mut self) {
        if self.pending.len() > 0 {
            error!("DROPPING NON-EMPTY PENDING BUFFER, {}", self.pending.len());
        }
    }
}

impl SinkType {
    pub(crate) fn new(buffer_size: usize) -> Self {
        SinkType {
            buffer_size,
            pending: VecDeque::new(),
        }
    }

    fn poll_request(
        &mut self,
        sock: &zmq::Socket,
        file: &EventedFile,
    ) -> Result<Async<()>, Error> {
        if let Some(mut multipart) = self.pending.pop_front() {
            match RequestFuture.poll(sock, file, &mut multipart)? {
                Async::Ready(()) => self.poll_request(sock, file),
                Async::NotReady => {
                    self.pending.push_front(multipart);
                    Ok(Async::NotReady)
                }
            }
        } else {
            Ok(Async::Ready(()))
        }
    }

    pub(crate) fn start_send(
        &mut self,
        multipart: Multipart,
        sock: &zmq::Socket,
        file: &EventedFile,
    ) -> Result<AsyncSink<Multipart>, Error> {
        if self.pending.len() > 0 {
            if self.pending.len() > self.buffer_size {
                if let Async::NotReady = self.poll_complete(sock, file)? {
                    if self.pending.len() > self.buffer_size {
                        return Ok(AsyncSink::NotReady(multipart));
                    } else {
                        return self.start_send(multipart, sock, file);
                    }
                } else {
                    return self.start_send(multipart, sock, file);
                }
            }
            self.pending.push_back(multipart);
            Ok(AsyncSink::Ready)
        } else {
            self.pending.push_back(multipart);
            Ok(AsyncSink::Ready)
        }
    }

    pub(crate) fn poll_complete(
        &mut self,
        sock: &zmq::Socket,
        file: &EventedFile,
    ) -> Result<Async<()>, Error> {
        if self.pending.len() > 0 {
            self.poll_request(sock, file)
        } else {
            Ok(Async::Ready(()))
        }
    }
}
