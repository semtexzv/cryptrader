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

extern crate futures;
extern crate tokio;
extern crate tokio_timer;
extern crate tokio_zmq;
extern crate zmq;

use std::{
    io,
    sync::Arc,
    time::{Duration, Instant},
};

use futures::{stream::iter_ok, Future, Stream};
use tokio_timer::{Error as TimerError, Interval};
use tokio_zmq::prelude::*;
use tokio_zmq::{Error as ZmqFutError, Push};

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
    let workers_fut = Push::builder(Arc::clone(&ctx)).bind("tcp://*:5557").build();
    let sink_fut = Push::builder(Arc::clone(&ctx))
        .connect("tcp://localhost:5558")
        .build();
    let sink2_fut = Push::builder(ctx).connect("tcp://localhost:5558").build();

    let start_msg = zmq::Message::from_slice(b"START").into();
    let stop_msg = zmq::Message::from_slice(b"STOP").into();

    let interval = Interval::new(Instant::now(), Duration::from_millis(200));

    let process = workers_fut
        .join(sink_fut)
        .join(sink2_fut)
        .from_err()
        .and_then(move |((workers, sink), sink2)| {
            sink.send(start_msg).map_err(Error::from).and_then(|_| {
                iter_ok(0..10)
                    .zip(interval)
                    .map_err(Error::from)
                    .and_then(|(i, _)| {
                        println!("Sending: {}", i);

                        let msg = format!("{}", i);
                        let msg = msg.as_bytes();
                        let msg = zmq::Message::from_slice(msg);

                        Ok(msg.into())
                    })
                    .forward(workers.sink(25))
                    .and_then(move |_| sink2.send(stop_msg).map_err(Error::from))
            })
        });

    tokio::run(process.map(|_| ()).or_else(|e| {
        println!("Error: {:?}", e);
        Ok(())
    }));
}
