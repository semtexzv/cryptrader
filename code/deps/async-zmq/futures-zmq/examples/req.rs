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

extern crate env_logger;
extern crate futures;
extern crate futures_zmq;
extern crate log;
extern crate tokio;
extern crate zmq;

use std::sync::Arc;

use futures::{stream::iter_ok, Future, Stream};
use futures_zmq::{prelude::*, Multipart, Req};

fn build_multipart(i: usize) -> Multipart {
    let mut multipart = Multipart::new();

    let msg1 = zmq::Message::from_slice(format!("Hewwo? {}", i).as_bytes());
    let msg2 = zmq::Message::from_slice(format!("Mr Obama??? {}", i).as_bytes());

    multipart.push_back(msg1);
    multipart.push_back(msg2);
    multipart
}

fn main() {
    env_logger::init();

    let ctx = Arc::new(zmq::Context::new());
    let req_fut = Req::builder(ctx).connect("tcp://localhost:5560").build();

    let runner = req_fut.and_then(|req| {
        req.send(build_multipart(0)).and_then(|req| {
            let (sink, stream) = req.sink_stream(25).split();

            stream
                .zip(iter_ok(1..10_000))
                .map(|(multipart, i)| {
                    for msg in multipart {
                        if let Some(msg) = msg.as_str() {
                            println!("Received: {}", msg);
                        }
                    }
                    build_multipart(i)
                })
                .forward(sink)
        })
    });

    tokio::run(runner.map(|_| ()).or_else(|e| {
        println!("Error: {:?}", e);
        Ok(())
    }));
}
