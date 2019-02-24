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

use failure::Fail;
use futures::sync::oneshot::Canceled;

#[derive(Debug, Fail)]
pub enum Error {
    #[fail(display = "Error in zeroMQ, {}", _0)]
    Zmq(#[cause] zmq::Error),

    #[fail(display = "Sender was dropped")]
    Canceled,

    #[fail(display = "Polling called while polling")]
    Polling,

    #[fail(display = "Socket dropped")]
    Dropped,
}

impl From<zmq::Error> for Error {
    fn from(e: zmq::Error) -> Self {
        Error::Zmq(e)
    }
}

impl From<Canceled> for Error {
    fn from(_: Canceled) -> Self {
        Error::Canceled
    }
}
