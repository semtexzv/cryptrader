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

extern crate futures;
extern crate futures_zmq;
extern crate tokio;
extern crate tokio_timer;
extern crate zmq;

use std::{
    io,
    sync::Arc,
    time::{Duration, Instant},
};

use futures::{Future, Stream};
use futures_zmq::prelude::*;
use futures_zmq::{Error as ZmqFutError, Pub};
use tokio_timer::{Error as TimerError, Interval};

#[derive(Debug)]
enum Error {
    ZmqFut(ZmqFutError),
    Zmq(zmq::Error),
    Io(io::Error),
    Timer(TimerError),
}

impl From<ZmqFutError> for Error {
    fn from(e: ZmqFutError) -> Self {
        Error::ZmqFut(e)
    }
}

impl From<zmq::Error> for Error {
    fn from(e: zmq::Error) -> Self {
        Error::Zmq(e)
    }
}

impl From<io::Error> for Error {
    fn from(e: io::Error) -> Self {
        Error::Io(e)
    }
}

impl From<TimerError> for Error {
    fn from(e: TimerError) -> Self {
        Error::Timer(e)
    }
}

fn main() {
    let ctx = Arc::new(zmq::Context::new());
    let zpub_fut = Pub::builder(ctx).bind("tcp://*:5556").build();

    let producer = zpub_fut.from_err().and_then(|zpub| {
        Interval::new(Instant::now(), Duration::from_secs(1))
            .map_err(Error::from)
            .and_then(|_| {
                println!("Sending 'Hello'");
                Ok(zmq::Message::from_slice(b"Hello").into())
            })
            .forward(zpub.sink(25))
    });

    tokio::run(producer.map(|_| ()).or_else(|e| {
        println!("Error in producer: {:?}", e);
        Ok(())
    }));
}
