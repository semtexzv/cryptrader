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
extern crate tokio_executor;
extern crate tokio_zmq;
extern crate zmq;

use std::{env, sync::Arc, thread};

use futures::{stream::iter_ok, Future, Stream};
use tokio_zmq::{prelude::*, Dealer, Multipart, Pub, Rep, Req, Router, Sub};

const CLIENT_REQUESTS: usize = 1000;

pub struct Stop;

impl ControlHandler for Stop {
    fn should_stop(&mut self, _: Multipart) -> bool {
        println!("Got stop signal");
        true
    }
}

fn client() {
    let ctx = Arc::new(zmq::Context::new());
    let req_fut = Req::builder(Arc::clone(&ctx))
        .connect("tcp://localhost:5559")
        .build();

    let zpub_fut = Pub::builder(Arc::clone(&ctx)).bind("tcp://*:5561").build();

    println!("Sending 'Hewwo?' for 0");
    let runner = req_fut
        .and_then(|req| {
            req.send(zmq::Message::from_slice(b"Hewwo?").into())
                .and_then(|req| {
                    let (sink, stream) = req.sink_stream(25).split();

                    stream
                        .zip(iter_ok(1..CLIENT_REQUESTS))
                        .map(|(multipart, request_nbr)| {
                            for msg in multipart {
                                if let Some(msg) = msg.as_str() {
                                    println!("Received reply {} {}", request_nbr, msg);
                                }
                            }

                            println!("Sending 'Hewwo?' for {}", request_nbr);
                            zmq::Message::from_slice(b"Hewwo?").into()
                        })
                        .forward(sink)
                })
        })
        .join(zpub_fut)
        .and_then(move |((stream, _sink), zpub)| {
            stream
                .into_future()
                .map_err(|(e, _)| e)
                .and_then(|(maybe_last_item, _stream)| {
                    if let Some(multipart) = maybe_last_item {
                        for msg in multipart {
                            if let Some(msg) = msg.as_str() {
                                println!("Received last reply {}", msg);
                            }
                        }
                    }

                    let msg = zmq::Message::from_slice(b"");

                    zpub.send(msg.into())
                })
        });

    tokio::run(runner.map(|_| ()).or_else(|e| {
        println!("Error in client: {:?}", e);
        Ok(())
    }));
}

fn worker() {
    let ctx = Arc::new(zmq::Context::new());

    let rep_fut = Rep::builder(Arc::clone(&ctx))
        .connect("tcp://localhost:5560")
        .build();

    let cmd_fut = Sub::builder(Arc::clone(&ctx))
        .connect("tcp://localhost:5561")
        .filter(b"")
        .build();

    let runner = rep_fut.join(cmd_fut).and_then(|(rep, cmd)| {
        let (rep_sink, rep_stream) = rep.sink_stream(25).split();

        rep_stream
            .controlled(cmd.stream(), Stop)
            .map(|multipart| {
                for msg in multipart {
                    if let Some(msg) = msg.as_str() {
                        println!("Received request: {}", msg);
                    } else {
                        println!("Received unparsable request: {:?}", msg);
                    }
                }

                let msg = zmq::Message::from_slice(b"Mr Obama???");

                msg.into()
            })
            .forward(rep_sink)
    });

    tokio::run(runner.map(|_| ()).or_else(|e| {
        println!("Error in worker: {:?}", e);
        Ok(())
    }));
}

fn broker() {
    let ctx = Arc::new(zmq::Context::new());

    let router_fut = Router::builder(Arc::clone(&ctx))
        .bind("tcp://*:5559")
        .build();

    let dealer_fut = Dealer::builder(Arc::clone(&ctx))
        .bind("tcp://*:5560")
        .build();

    let cmd1_fut = Sub::builder(Arc::clone(&ctx))
        .connect("tcp://localhost:5561")
        .filter(b"")
        .build();
    let cmd2_fut = Sub::builder(Arc::clone(&ctx))
        .connect("tcp://localhost:5561")
        .filter(b"")
        .build();

    let runner = dealer_fut
        .join(router_fut)
        .join(cmd1_fut.join(cmd2_fut))
        .and_then(|((dealer, router), (cmd1, cmd2))| {
            let (dealer_sink, dealer_stream) = dealer.sink_stream(25).split();
            let (router_sink, router_stream) = router.sink_stream(25).split();

            let d2r = dealer_stream
                .controlled(cmd1.stream(), Stop)
                .map(|multipart| {
                    for msg in &multipart {
                        if let Some(msg) = msg.as_str() {
                            println!("Relaying message '{}' to router", msg);
                        } else {
                            println!("Relaying unknown message to router");
                        }
                    }
                    multipart
                })
                .forward(router_sink);

            let r2d = router_stream
                .controlled(cmd2.stream(), Stop)
                .map(|multipart| {
                    for msg in &multipart {
                        if let Some(msg) = msg.as_str() {
                            println!("Relaying message '{}' to dealer", msg);
                        } else {
                            println!("Relaying unknown message to dealer");
                        }
                    }
                    multipart
                })
                .forward(dealer_sink);

            d2r.join(r2d)
        });

    tokio::run(runner.map(|_| ()).or_else(|e| {
        println!("broker bailed: {:?}", e);
        Ok(())
    }));
}

#[derive(Debug, PartialEq)]
enum Selection {
    All,
    Broker,
    Worker,
    Client,
}

impl Selection {
    fn broker(&self) -> bool {
        *self == Selection::All || *self == Selection::Broker
    }

    fn worker(&self) -> bool {
        *self == Selection::All || *self == Selection::Worker
    }

    fn client(&self) -> bool {
        *self == Selection::All || *self == Selection::Client
    }
}

fn main() {
    env_logger::init();

    let selection = env::var("SELECTION").unwrap_or_else(|_| "all".into());

    let selection = match selection.as_ref() {
        "broker" => Selection::Broker,
        "worker" => Selection::Worker,
        "client" => Selection::Client,
        _ => Selection::All,
    };

    println!("SELECTION: {:?}", selection);

    let mut broker_thread = None;
    let mut worker_thread = None;
    let mut client_thread = None;

    if selection.broker() {
        broker_thread = Some(thread::spawn(broker));
    }
    if selection.worker() {
        worker_thread = Some(thread::spawn(worker));
    }
    if selection.client() {
        client_thread = Some(thread::spawn(client));
    }

    if let Some(broker_thread) = broker_thread {
        broker_thread.join().unwrap();
    }
    if let Some(worker_thread) = worker_thread {
        worker_thread.join().unwrap();
    }
    if let Some(client_thread) = client_thread {
        client_thread.join().unwrap();
    }
}
