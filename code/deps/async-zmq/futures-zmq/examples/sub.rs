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
extern crate zmq;

use std::sync::Arc;

use futures::{Future, Stream};
use futures_zmq::{prelude::*, Sub};

fn main() {
    let ctx = Arc::new(zmq::Context::new());
    let sub_fut = Sub::builder(ctx)
        .connect("tcp://localhost:5556")
        .filter(b"")
        .build();

    let consumer = sub_fut.and_then(|sub| {
        sub.stream().for_each(|multipart| {
            for msg in multipart {
                if let Some(msg) = msg.as_str() {
                    println!("Received: {}", msg);
                }
            }

            Ok(())
        })
    });

    tokio::run(consumer.map(|_| ()).or_else(|e| {
        println!("Error in consumer: {:?}", e);
        Ok(())
    }));
}
