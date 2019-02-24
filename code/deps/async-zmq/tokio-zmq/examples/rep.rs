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

extern crate env_logger;
extern crate futures;
extern crate log;
extern crate tokio;
extern crate tokio_zmq;
extern crate zmq;

use std::sync::Arc;

use futures::{Future, Stream};
use tokio_zmq::{prelude::*, Rep};

fn main() {
    env_logger::init();

    let ctx = Arc::new(zmq::Context::new());
    let rep_fut = Rep::builder(ctx).bind("tcp://*:5560").build();

    let runner = rep_fut.and_then(|rep| {
        let (sink, stream) = rep.sink_stream(25).split();

        stream
            .map(|multipart| {
                for msg in &multipart {
                    if let Some(s) = msg.as_str() {
                        println!("RECEIVED: {}", s);
                    }
                }
                multipart
            })
            .forward(sink)
    });

    tokio::run(runner.map(|_| ()).or_else(|e| {
        println!("Error: {:?}", e);
        Ok(())
    }));
}
