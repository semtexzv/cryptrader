/*
 * This file is part of Async ZMQ Types.
 *
 * Copyright © 2018 Riley Trautman
 *
 * Async ZMQ Types is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Async ZMQ Types is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Async ZMQ Types.  If not, see <http://www.gnu.org/licenses/>.
 */

//! This module contains `SocketBuilder` and related types.

use std::{marker::PhantomData, sync::Arc};

use zmq;

use crate::{IntoInnerSocket, Pair, Sub, UnPair};
use zmq::Socket;

fn bind_all(sock: zmq::Socket, binds: &[&str]) -> zmq::Result<zmq::Socket> {
    for bind in binds {
        sock.bind(bind)?;
    }
    Ok(sock)
}

fn connect_all(sock: zmq::Socket, connects: &[&str]) -> zmq::Result<zmq::Socket> {
    for connect in connects {
        sock.connect(connect)?;
    }
    Ok(sock)
}

/// The root struct for a Socket builder
///
/// This struct contains a context and an identity.
pub struct SocketBuilder<'a, T>
where
    T: IntoInnerSocket,
{
    ctx: Arc<zmq::Context>,
    identity: Option<&'a [u8]>,
    custom : Box<Fn(&Socket)>,
    _type: PhantomData<T>,
}

impl<'a, T> SocketBuilder<'a, T>
where
    T: IntoInnerSocket,
{
    /// Create a new Socket builder
    ///
    /// All sockets that are created through the Async ZMQ Types library will use this as the base
    /// for their socket builder (except PAIR sockets).
    pub fn new(ctx: Arc<zmq::Context>) -> Self {
        SocketBuilder {
            ctx,
            identity: None,
            custom : Box::new(|_| {}),
            _type: PhantomData,
        }
    }

    /// Give the socket a custom identity
    pub fn identity(self, identity: &'a [u8]) -> Self {
        SocketBuilder {
            identity: Some(identity),
            .. self
        }
    }
    pub fn customize<F>(self, f: F) -> Self
        where F : Fn(&zmq::Socket) + 'static
    {
        SocketBuilder {
            custom : Box::new(f),
            .. self
        }

    }

    /// Bind the socket to an address
    ///
    /// Since this is just part of the builder, and the socket doesn't exist yet, we store the
    /// address for later retrieval.
    pub fn bind(self, addr: &'a str) -> SockConfig<'a, T> {
        SockConfig {
            ctx: self.ctx,
            bind: vec![addr],
            connect: Vec::new(),
            identity: self.identity,
            customize : self.custom,
            _type: self._type,
        }
    }

    /// Connect the socket to an address
    ///
    /// Since this is just part of the builder, and the socket doesn't exist yet, we store the
    /// address for later retrieval.
    pub fn connect(self, addr: &'a str) -> SockConfig<'a, T> {
        SockConfig {
            ctx: self.ctx,
            bind: Vec::new(),
            connect: vec![addr],
            identity: self.identity,
            customize : self.custom,
            _type: self._type,
        }
    }
}

/// The final builder step for some socket types
///
/// This contains all the information required to contstruct a valid socket, except in the case of
/// SUB, which needs an additional `filter` parameter.
pub struct SockConfig<'a, T>
where
    T: IntoInnerSocket,
{
    pub ctx: Arc<zmq::Context>,
    pub bind: Vec<&'a str>,
    pub connect: Vec<&'a str>,
    pub identity: Option<&'a [u8]>,
    customize :  Box<Fn(&Socket)>,
    _type: PhantomData<T>,
}

impl<'a, T> SockConfig<'a, T>
where
    T: UnPair + IntoInnerSocket,
{
    /// Bind the `SockConfig` to an address, returning a `SockConfig`
    ///
    /// This allows for a single socket to be bound to multiple addresses.
    pub fn bind(mut self, addr: &'a str) -> Self {
        self.bind.push(addr);
        self
    }

    /// Connect the `SockConfig` to an address, returning a `SockConfig`
    ///
    /// This allows for a single socket to be connected to multiple addresses.
    pub fn connect(mut self, addr: &'a str) -> Self {
        self.connect.push(addr);
        self
    }

    pub fn do_build(self) -> Result<zmq::Socket, zmq::Error> {
        let SockConfig {
            ctx,
            bind,
            connect,
            identity,
            customize,
            _type,
        } = self;

        let sock = ctx.socket(T::kind())?;
        if let Some(identity) = identity {
            sock.set_identity(identity)?;
        }
        customize(&sock);
        let sock = bind_all(sock, &bind)?;
        let sock = connect_all(sock, &connect)?;

        Ok(sock)
    }
}

impl<'a, T> SockConfig<'a, T>
where
    T: IntoInnerSocket + Pair,
{
    /// Bind or Connect the socket to an address
    ///
    /// This method indicates that the resulting socket will be a PAIR socket.
    pub fn pair(self, addr: &'a str, bind: bool) -> PairConfig<'a> {
        PairConfig {
            ctx: self.ctx,
            addr,
            bind,
            identity: self.identity,
        }
    }
}

impl<'a, T> SockConfig<'a, T>
where
    T: IntoInnerSocket + Sub,
{
    /// Continue the building process into a SubConfig, for the SUB socket type which requires
    /// setting a subscription filter.
    pub fn filter(self, pattern: &'a [u8]) -> SubConfig<'a> {
        SubConfig {
            ctx: self.ctx,
            bind: self.bind,
            connect: self.connect,
            identity: self.identity,
            filter: vec![pattern],
        }
    }
}

/// The final builder step for the Sub socket type.
///
/// This contains all the information required to contstruct a valid SUB socket
pub struct SubConfig<'a> {
    pub ctx: Arc<zmq::Context>,
    pub bind: Vec<&'a str>,
    pub connect: Vec<&'a str>,
    pub filter: Vec<&'a [u8]>,
    pub identity: Option<&'a [u8]>,
}

impl<'a> SubConfig<'a> {
    /// Continue the building process into a SubConfig, for the SUB socket type which requires
    /// setting a subscription filter.
    pub fn filter(mut self, pattern: &'a [u8]) -> SubConfig<'a> {
        self.filter.push(pattern);

        SubConfig {
            ctx: self.ctx,
            bind: self.bind,
            connect: self.connect,
            identity: self.identity,
            filter: self.filter,
        }
    }

    /// Finalize the `SubConfig` into a `Sub` if the creation is successful, or into an Error
    /// if something went wrong.
    pub fn do_build(self) -> Result<zmq::Socket, zmq::Error> {
        let SubConfig {
            ctx,
            bind,
            connect,
            filter,
            identity,
        } = self;

        let sock = ctx.socket(zmq::SUB)?;
        if let Some(identity) = identity {
            sock.set_identity(identity)?;
        }
        let sock = bind_all(sock, &bind)?;
        let sock = connect_all(sock, &connect)?;
        for pattern in filter {
            sock.set_subscribe(pattern)?;
        }

        Ok(sock)
    }
}

/// The final builder step for the Pair socket type.
///
/// This contains all the information required to contstruct a valid PAIR socket
pub struct PairConfig<'a> {
    ctx: Arc<zmq::Context>,
    addr: &'a str,
    bind: bool,
    identity: Option<&'a [u8]>,
}

impl<'a> PairConfig<'a> {
    /// Construct a raw `Socket` type from the given `PairConfig`
    ///
    /// This build takes the same arguments as the `SockConfig`'s build method for convenience, but
    /// this should not be called with `zmq::SocketType`s other than `zmq::PAIR`. The `Pair`
    /// wrapper uses this builder, so it is better to use the Pair wrapper than directly building a
    /// PAIR socket.
    pub fn do_build(self) -> Result<zmq::Socket, zmq::Error> {
        let PairConfig {
            ctx,
            addr,
            bind,
            identity,
        } = self;

        let sock = ctx.socket(zmq::PAIR)?;
        if let Some(identity) = identity {
            sock.set_identity(identity)?;
        }
        if bind {
            sock.bind(addr)?;
        } else {
            sock.connect(addr)?;
        }

        Ok(sock)
    }
}
