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

use std::io::Error as IoError;

use failure::Fail;
use tokio_timer::Error as TimerError;
use zmq::Error as ZmqError;

/// Defines the error type for Tokio ZMQ.
///
/// Errors here can come from two places, IO, and ZeroMQ. Most errors encountered in this
/// application are ZeroMQ errors, so `Error::Zmq(_)` is common, although we also need to catch IO
/// errors from Tokio's `PollEvented` creation and TokioFileUnix's File creation.
#[derive(Debug, Fail)]
pub enum Error {
    #[fail(display = "Error in ZeroMQ: {}", _0)]
    /// Stores ZeroMQ Errors
    Zmq(#[cause] ZmqError),

    #[fail(display = "Error creating file descriptor: {}", _0)]
    /// Stores PollEvented and File creation errors
    Io(#[cause] IoError),

    #[fail(display = "Error creating timer: {}", _0)]
    /// Stores Tokio Timer errors
    Timer(#[cause] TimerError),

    #[fail(display = "Could not send message to ZeroMQ")]
    /// If Sink socket is not done handling current request
    Sink,

    #[fail(display = "Could not receive message from ZeroMQ")]
    /// If Stream socket is not done handling current request
    Stream,

    #[fail(display = "Attempted to re-use already-used future")]
    /// If a future is used after it is consumed
    Reused,
}

impl From<ZmqError> for Error {
    fn from(e: ZmqError) -> Self {
        Error::Zmq(e)
    }
}

impl From<IoError> for Error {
    fn from(e: IoError) -> Self {
        Error::Io(e)
    }
}

impl From<TimerError> for Error {
    fn from(e: TimerError) -> Self {
        Error::Timer(e)
    }
}
