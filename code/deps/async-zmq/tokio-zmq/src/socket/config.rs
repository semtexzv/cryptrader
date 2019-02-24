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

//! This module contains `SocketBuilder` and related types.

use async_zmq_types::{IntoInnerSocket, PairConfig, SockConfig, SubConfig, UnPair};
use futures::{future::lazy, Future};

use crate::{
    error::Error,
    prelude::Build,
    socket::{
        types::{Pair, Sub},
        Socket,
    },
};

impl<'a, T> Build<T> for SockConfig<'a, T>
where
    T: UnPair + IntoInnerSocket + From<Socket> + 'static,
{
    fn build(self) -> Box<dyn Future<Item = T, Error = Error> + Send> {
        let res = self.do_build();

        let fut = lazy(move || res)
            .from_err()
            .and_then(Socket::from_sock)
            .map(T::from);

        Box::new(fut)
    }
}

impl<'a> Build<Sub> for SubConfig<'a> {
    fn build(self) -> Box<dyn Future<Item = Sub, Error = Error> + Send> {
        let sock = self.do_build();

        let fut = lazy(move || sock)
            .from_err()
            .and_then(Socket::from_sock)
            .map(Sub::from);

        Box::new(fut)
    }
}

impl<'a> Build<Pair> for PairConfig<'a> {
    fn build(self) -> Box<dyn Future<Item = Pair, Error = Error> + Send> {
        let sock = self.do_build();

        let fut = lazy(move || sock)
            .from_err()
            .and_then(Socket::from_sock)
            .map(Pair::from);

        Box::new(fut)
    }
}
