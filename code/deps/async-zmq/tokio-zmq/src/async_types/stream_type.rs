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

use async_zmq_types::Multipart;
use futures::Async;
use log::error;
use zmq;

use crate::{
    async_types::{future_types::ResponseFuture, EventedFile},
    error::Error,
};

pub(crate) struct StreamType {
    multipart: Multipart,
}

impl StreamType {
    pub(crate) fn new() -> Self {
        StreamType {
            multipart: Multipart::new(),
        }
    }

    pub(crate) fn poll(
        &mut self,
        sock: &zmq::Socket,
        file: &EventedFile,
    ) -> Result<Async<Option<Multipart>>, Error> {
        match ResponseFuture.poll(&sock, &file, &mut self.multipart)? {
            Async::Ready(item) => {
                Ok(Async::Ready(Some(item)))
            }
            Async::NotReady => {
                Ok(Async::NotReady)
            }
        }
    }
}

impl Drop for StreamType {
    fn drop(&mut self) {
        if self.multipart.len() > 0 {
            error!("DROPPING RECEIVED NON-EMPTY MULTIPART, {}", self.multipart.len());
        }
    }
}
