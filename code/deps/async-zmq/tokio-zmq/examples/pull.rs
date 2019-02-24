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
extern crate tokio_executor;
extern crate tokio_zmq;
extern crate zmq;

use std::sync::Arc;

use futures::{Future, Stream};
use tokio_zmq::{prelude::*, Multipart, Pub, Pull, Sub};

pub struct Stop;

impl ControlHandler for Stop {
    fn should_stop(&mut self, _: Multipart) -> bool {
        println!("Got stop signal");
        true
    }
}

fn main() {
    let ctx = Arc::new(zmq::Context::new());
    let cmd_fut = Sub::builder(Arc::clone(&ctx))
        .connect("tcp://localhost:5559")
        .filter(b"")
        .build();
    let conn_fut = Pull::builder(Arc::clone(&ctx)).bind("tcp://*:5558").build();
    let send_cmd_fut = Pub::builder(ctx).bind("tcp://*:5559").build();

    let process = cmd_fut
        .join(conn_fut)
        .join(send_cmd_fut)
        .and_then(|((cmd, conn), send_cmd)| {
            conn.stream()
                .controlled(cmd.stream(), Stop)
                .filter_map(|multipart| {
                    multipart
                        .into_iter()
                        .filter_map(|msg| {
                            let stop = if let Some(s_msg) = msg.as_str() {
                                println!("msg: '{}'", s_msg);
                                s_msg == "STOP"
                            } else {
                                false
                            };

                            if stop {
                                Some(msg)
                            } else {
                                None
                            }
                        })
                        .collect::<Vec<_>>()
                        .pop()
                        .map(Multipart::from)
                })
                .forward(send_cmd.sink(25))
        });

    tokio::run(process.map(|_| ()).or_else(|e| {
        println!("Error: {:?}", e);
        Ok(())
    }));
}
