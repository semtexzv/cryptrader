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

//! This module defines all the socket wrapper types that can be used with Tokio.

use async_zmq_derive::SocketWrapper;
use zmq::SocketType::{self, DEALER, PAIR, PUB, PULL, PUSH, REP, REQ, ROUTER, SUB, XPUB, XSUB};

use crate::{async_types::EventedFile, socket::Socket};

// needed for derive
type RawSocket = (zmq::Socket, EventedFile);

/* -------------------------------------------------------------------------- */

/// The DEALER `SocketType` wrapper type.
///
/// Dealer implements `StreamSocket` and `SinkSocket`, and has an associated controlled variant.
#[derive(Debug, SocketWrapper)]
#[stream]
#[sink]
pub struct Dealer {
    pub(crate) inner: Socket,
}

/* -------------------------------------------------------------------------- */

/// The PAIR `SocketType` wrapper type.
///
/// Pair implements `StreamSocket` and `SinkSocket`, and has an associated controlled variant.
#[derive(Debug, SocketWrapper)]
#[stream]
#[sink]
pub struct Pair {
    pub(crate) inner: Socket,
}

/* -------------------------------------------------------------------------- */

/// The PUB `SocketType` wrapper type
///
/// Pub implements `SinkSocket`.
#[derive(Debug, SocketWrapper)]
#[sink]
pub struct Pub {
    pub(crate) inner: Socket,
}

/* -------------------------------------------------------------------------- */

/// The PULL `SocketType` wrapper type
///
/// Pull implements `StreamSocket`, and has an associated controlled variant.
#[derive(Debug, SocketWrapper)]
#[stream]
pub struct Pull {
    pub(crate) inner: Socket,
}

/* -------------------------------------------------------------------------- */

/// The PUSH `SocketType` wrapper type
///
/// Push implements `SinkSocket`.
#[derive(Debug, SocketWrapper)]
#[sink]
pub struct Push {
    pub(crate) inner: Socket,
}

/* -------------------------------------------------------------------------- */

/// The REP `SocketType` wrapper type
///
/// Rep implements `StreamSocket` and `SinkSocket`, and has an associated controlled variant.
#[derive(Debug, SocketWrapper)]
#[stream]
#[sink]
pub struct Rep {
    pub(crate) inner: Socket,
}

/* -------------------------------------------------------------------------- */

/// The REQ `SocketType` wrapper type
///
/// Req implements `StreamSocket` and `SinkSocket`, and has an associated controlled variant.
#[derive(Debug, SocketWrapper)]
#[stream]
#[sink]
pub struct Req {
    pub(crate) inner: Socket,
}

/* -------------------------------------------------------------------------- */

/// The ROUTER `SocketType` wrapper type
///
/// Router implements `StreamSocket` and `SinkSocket`, and has an associated controlled variant.
#[derive(Debug, SocketWrapper)]
#[stream]
#[sink]
pub struct Router {
    pub(crate) inner: Socket,
}

/* -------------------------------------------------------------------------- */

/// The SUB `SocketType` wrapper type
///
/// Sub implements `StreamSocket`, and has an associated controlled variant.
#[derive(Debug, SocketWrapper)]
#[stream]
pub struct Sub {
    pub(crate) inner: Socket,
}

/* -------------------------------------------------------------------------- */

/// The XPUB `SocketType` wrapper type
///
/// Xpub implements `StreamSocket` and `SinkSocket`, and has an associated controlled variant.
#[derive(Debug, SocketWrapper)]
#[stream]
#[sink]
pub struct Xpub {
    pub(crate) inner: Socket,
}

/* -------------------------------------------------------------------------- */

/// The XSUB `SocketType` wrapper type
///
/// Xsub implements `StreamSocket` and `SinkSocket`, and has an associated controlled variant.
#[derive(Debug, SocketWrapper)]
#[stream]
#[sink]
pub struct Xsub {
    pub(crate) inner: Socket,
}
