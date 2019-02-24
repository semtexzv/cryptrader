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

//! This module contains definitions for `MultipartRequest` and `MultipartResponse`, the two types that
//! implement `futures::Future`.

use std::{fmt, marker::PhantomData};

use async_zmq_types::Multipart;
use futures::{Async, Future};
use zmq;

use crate::{
    async_types::{
        future_types::{RequestFuture, ResponseFuture},
        EventedFile,
    },
    error::Error,
    socket::Socket,
};

/// The `MultipartRequest` Future handles asynchronously sending data to a socket.
///
/// ### Example
/// ```rust
/// # extern crate zmq;
/// # extern crate futures;
/// # extern crate tokio_zmq;
/// #
/// # use std::sync::Arc;
/// #
/// # use futures::Future;
/// # use tokio_zmq::{prelude::*, async_types::MultipartRequest, Error, Rep};
/// #
/// # fn main() {
/// #     get_sock();
/// # }
/// # fn get_sock() -> impl Future<Item = (), Error = Error> {
/// #     let ctx = Arc::new(zmq::Context::new());
/// #     let rep = Rep::builder(ctx)
/// #         .bind("tcp://*:5567")
/// #         .build();
/// #
/// #     rep.and_then(|rep| {
/// #       let socket = rep.socket();
/// #       let (sock, file) = socket.inner();
/// #       let msg = zmq::Message::from_slice(format!("Hey").as_bytes());
/// MultipartRequest::new(sock, file, msg.into()).and_then(|_: Rep| {
///     // succesfull request
/// #       Ok(())
/// })
/// # })
/// # }
/// ```
pub struct MultipartRequest<T>
where
    T: From<Socket>,
{
    socks: Option<(zmq::Socket, EventedFile)>,
    multipart: Multipart,
    phantom: PhantomData<T>,
}

impl<T> MultipartRequest<T>
where
    T: From<Socket>,
{
    pub fn new(sock: zmq::Socket, file: EventedFile, multipart: Multipart) -> Self {
        MultipartRequest {
            socks: Some((sock, file)),
            multipart: multipart,
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
        if let Some((sock, file)) = self.socks.take() {
            match RequestFuture.poll(&sock, &file, &mut self.multipart)? {
                Async::Ready(()) => Ok(Async::Ready(Socket::from_sock_and_file(sock, file).into())),
                Async::NotReady => {
                    self.socks = Some((sock, file));

                    Ok(Async::NotReady)
                }
            }
        } else {
            Err(Error::Reused)
        }
    }
}

impl<T> fmt::Debug for MultipartRequest<T>
where
    T: From<Socket>,
{
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "SendFuture")
    }
}

impl<T> fmt::Display for MultipartRequest<T>
where
    T: From<Socket>,
{
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "SendFuture")
    }
}

/// The `MultipartResponse` Future handles asynchronously getting data from a socket.
///
/// ### Example
/// ```rust
/// # extern crate zmq;
/// # extern crate futures;
/// # extern crate tokio_zmq;
/// #
/// # use std::sync::Arc;
/// #
/// # use futures::Future;
/// # use tokio_zmq::{prelude::*, async_types::MultipartResponse, Error, Multipart, Rep};
/// #
/// # fn main() {
/// #     get_sock();
/// # }
/// # fn get_sock() -> impl Future<Item = Multipart, Error = Error> {
/// #     let ctx = Arc::new(zmq::Context::new());
/// #     let rep = Rep::builder(ctx)
/// #         .bind("tcp://*:5567")
/// #         .build();
/// #     rep.and_then(|rep| {
/// #         let socket = rep.socket();
/// #         let (sock, file) = socket.inner();
/// MultipartResponse::new(sock, file).and_then(|(multipart, _): (_, Rep)| {
///     // handle multipart response
///     # Ok(multipart)
/// })
/// # })
/// # }
/// ```
pub struct MultipartResponse<T>
where
    T: From<Socket>,
{
    socks: Option<(zmq::Socket, EventedFile)>,
    multipart: Multipart,
    phantom: PhantomData<T>,
}

impl<T> MultipartResponse<T>
where
    T: From<Socket>,
{
    pub fn new(sock: zmq::Socket, file: EventedFile) -> Self {
        MultipartResponse {
            socks: Some((sock, file)),
            multipart: Multipart::new(),
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
        if let Some((sock, file)) = self.socks.take() {
            match ResponseFuture.poll(&sock, &file, &mut self.multipart)? {
                Async::Ready(multipart) => Ok(Async::Ready((
                    multipart,
                    Socket::from_sock_and_file(sock, file).into(),
                ))),
                Async::NotReady => {
                    self.socks = Some((sock, file));

                    Ok(Async::NotReady)
                }
            }
        } else {
            Err(Error::Reused)
        }
    }
}

impl<T> fmt::Debug for MultipartResponse<T>
where
    T: From<Socket>,
{
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "RecvFuture")
    }
}

impl<T> fmt::Display for MultipartResponse<T>
where
    T: From<Socket>,
{
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "RecvFuture")
    }
}
