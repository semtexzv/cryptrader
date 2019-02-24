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
extern crate rand;
extern crate tokio;
extern crate tokio_zmq;
extern crate zmq;

use std::{env, fmt, sync::Arc, thread, time::Duration};

use futures::{sync::mpsc, Future, Sink, Stream};
use rand::RngCore;
use tokio_zmq::{prelude::*, Multipart, Pub, Req, Router, Sub};

const NUM_CLIENTS: usize = 1000;
const NUM_WORKERS: usize = 5;
const BATCH_SIZE: usize = 10;

/* ----------------------------------Error----------------------------------- */

#[derive(Debug)]
enum Error {
    Zmq(zmq::Error),
    TokioZmq(tokio_zmq::Error),
    WorkerSend,
    WorkerRecv,
    NotEnoughMessages,
    TooManyMessages,
    MsgNotEmpty,
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match *self {
            Error::Zmq(ref e) => write!(f, "Error in ZeroMQ: {}", e),
            Error::TokioZmq(ref e) => write!(f, "Error in Tokio ZMQ: {}", e),
            Error::WorkerSend => write!(f, "Error sending to worker"),
            Error::WorkerRecv => write!(f, "Error receiving from worker"),
            Error::NotEnoughMessages => write!(f, "Not enough messages"),
            Error::TooManyMessages => write!(f, "Too many messages"),
            Error::MsgNotEmpty => write!(f, "Message not empty"),
        }
    }
}

impl From<tokio_zmq::Error> for Error {
    fn from(e: tokio_zmq::Error) -> Self {
        Error::TokioZmq(e)
    }
}

impl From<zmq::Error> for Error {
    fn from(e: zmq::Error) -> Self {
        Error::Zmq(e)
    }
}

/* --------------------------------Envelope---------------------------------- */

struct Envelope {
    addr: zmq::Message,
    empty: zmq::Message,
    request: zmq::Message,
}

impl Envelope {
    fn addr(&self) -> &zmq::Message {
        &self.addr
    }

    fn request(&self) -> &zmq::Message {
        &self.request
    }

    fn set_request(&mut self, msg: zmq::Message) {
        self.request = msg;
    }

    fn from_multipart(mut m: Multipart) -> Result<Self, Error> {
        let addr = m.pop_front().ok_or(Error::NotEnoughMessages)?;
        let empty = m.pop_front().ok_or(Error::NotEnoughMessages)?;
        if !empty.is_empty() {
            return Err(Error::MsgNotEmpty);
        }
        let request = m.pop_front().ok_or(Error::NotEnoughMessages)?;

        if !m.is_empty() {
            return Err(Error::TooManyMessages);
        }

        Ok(Envelope {
            addr,
            empty,
            request,
        })
    }
}

impl From<Envelope> for Multipart {
    fn from(e: Envelope) -> Self {
        let mut multipart = Multipart::new();

        multipart.push_back(e.addr);
        multipart.push_back(e.empty);
        multipart.push_back(e.request);

        multipart
    }
}

/* -----------------------------------Stop----------------------------------- */

struct Stop(&'static str, usize);

impl ControlHandler for Stop {
    fn should_stop(&mut self, _: Multipart) -> bool {
        println!("Received stop signal! {}/{}", self.0, self.1);
        true
    }
}

/* ----------------------------------client---------------------------------- */

fn client_task(client_num: usize) -> usize {
    let context = Arc::new(zmq::Context::new());

    let client_fut = Req::builder(context)
        .identity(format!("c{}", client_num).as_bytes())
        .connect("tcp://localhost:5672")
        .build();

    let msg = zmq::Message::from_slice(b"HELLO");
    let fut = client_fut.and_then(move |client| {
        client
            .send(msg.into())
            .from_err()
            .and_then(|client| client.recv())
            .and_then(move |(multipart, _)| {
                if let Some(msg) = multipart.get(0) {
                    println!("Client {}: {}", client_num, msg.as_str().unwrap());
                }
                Ok(())
            })
    });

    tokio::run(fut.map(|_| ()).or_else(|e| {
        println!("Error in client: {}, {:?}", e, e);
        Ok(())
    }));
    client_num
}

/* ----------------------------------worker---------------------------------- */

fn worker_task(worker_num: usize) -> usize {
    let context = Arc::new(zmq::Context::new());

    let control_fut = Sub::builder(Arc::clone(&context))
        .connect("tcp://localhost:5674")
        .filter(b"")
        .build();
    let worker_fut = Req::builder(context)
        .identity(format!("w{}", worker_num).as_bytes())
        .connect("tcp://localhost:5673")
        .build();

    let msg = zmq::Message::from_slice(b"READY");

    let fut = worker_fut
        .join(control_fut)
        .from_err()
        .and_then(move |(worker, control)| {
            worker
                .send(msg.into())
                .map_err(Error::from)
                .and_then(move |worker| {
                    let (sink, stream) = worker.sink_stream(25).split();

                    stream
                        .controlled(control.stream(), Stop("worker", worker_num))
                        .map_err(Error::from)
                        .and_then(move |multipart| {
                            let mut envelope: Envelope = Envelope::from_multipart(multipart)?;

                            println!(
                                "Worker {}: {} from {}",
                                worker_num,
                                envelope.request().as_str().unwrap(),
                                envelope.addr().as_str().unwrap()
                            );

                            let msg = zmq::Message::from_slice(b"OK");
                            envelope.set_request(msg);

                            Ok(envelope.into())
                        })
                        .forward(sink)
                })
        });

    tokio::run(fut.map(|_| ()).or_else(|e| {
        println!("Error in worker: {}, {:?}", e, e);
        Ok(())
    }));
    println!("Worker {} is done", worker_num);
    worker_num
}

/* ----------------------------------broker---------------------------------- */

fn broker_task() {
    let context = Arc::new(zmq::Context::new());

    let frontend_fut = Router::builder(Arc::clone(&context))
        .bind("tcp://*:5672")
        .build();

    let control0_fut = Sub::builder(Arc::clone(&context))
        .connect("tcp://localhost:5674")
        .filter(b"")
        .build();

    let control1_fut = Sub::builder(Arc::clone(&context))
        .connect("tcp://localhost:5674")
        .filter(b"")
        .build();

    let backend_fut = Router::builder(context).bind("tcp://*:5673").build();

    let runner = frontend_fut
        .join(backend_fut)
        .join(control0_fut.join(control1_fut))
        .from_err()
        .and_then(|((frontend, backend), (control0, control1))| {
            let (worker_send, worker_recv) = mpsc::channel::<zmq::Message>(10);

            let (frontend_sink, frontend_stream) = frontend.sink_stream(25).split();
            let (backend_sink, backend_stream) = backend.sink_stream(25).split();

            let back2front = backend_stream
                .controlled(control0.stream(), Stop("broker", 0))
                .map_err(Error::from)
                .and_then(|mut multipart| {
                    let worker_id = multipart.pop_front().ok_or(Error::NotEnoughMessages)?;

                    Ok((multipart, worker_id))
                })
                .and_then(move |(multipart, worker_id)| {
                    worker_send
                        .clone()
                        .send(worker_id)
                        .map(|_| multipart)
                        .map_err(|_| Error::WorkerSend)
                })
                .filter_map(|mut multipart| {
                    let empty = multipart.pop_front().unwrap();
                    assert!(empty.is_empty());
                    let client_id = multipart.pop_front().unwrap();

                    if &*client_id == b"READY" {
                        None
                    } else {
                        Some((multipart, client_id))
                    }
                })
                .and_then(|(mut multipart, client_id)| {
                    let empty = multipart.pop_front().ok_or(Error::NotEnoughMessages)?;
                    assert!(empty.is_empty());
                    let reply = multipart.pop_front().ok_or(Error::NotEnoughMessages)?;

                    let mut response = Multipart::new();

                    response.push_back(client_id);
                    response.push_back(empty);
                    response.push_back(reply);

                    Ok(response)
                })
                .forward(frontend_sink);

            let front2back = frontend_stream
                .controlled(control1.stream(), Stop("broker", 1))
                .map_err(Error::from)
                .zip(worker_recv.map_err(|_| Error::WorkerRecv))
                .and_then(|(mut multipart, worker_id)| {
                    let client_id = multipart.pop_front().ok_or(Error::NotEnoughMessages)?;
                    let empty = multipart.pop_front().ok_or(Error::NotEnoughMessages)?;
                    assert!(empty.is_empty());
                    let request = multipart.pop_front().ok_or(Error::NotEnoughMessages)?;

                    let mut response = Multipart::new();

                    response.push_back(worker_id);
                    response.push_back(empty);
                    response.push_back(client_id);
                    response.push_back(zmq::Message::new());
                    response.push_back(request);

                    Ok(response)
                })
                .forward(backend_sink);

            front2back.join(back2front)
        });

    tokio::run(runner.map(|_| ()).or_else(|e| {
        println!("Error in broker: {}, {:?}", e, e);
        Ok(())
    }));
    println!("Broker is done");
}

/* --------------------------------use_broker-------------------------------- */

#[derive(Clone, Debug, Eq, PartialEq)]
enum ProcessKind {
    Broker,
    Worker,
    Client,
    All,
}

/* -----------------------------------main----------------------------------- */

fn main() {
    env_logger::init();

    let use_broker = match env::var("PROCESS_KIND")
        .unwrap_or_else(|_| "all".to_owned())
        .as_str()
    {
        "broker" => ProcessKind::Broker,
        "worker" => ProcessKind::Worker,
        "client" => ProcessKind::Client,
        _ => ProcessKind::All,
    };

    let mut broker_thread = None;

    match use_broker {
        ProcessKind::Broker | ProcessKind::All => {
            // Spawn threads
            broker_thread = Some(thread::spawn(broker_task));
        }
        _ => (),
    };

    let workers = match use_broker {
        ProcessKind::Worker => vec![thread::spawn(move || {
            worker_task(rand::thread_rng().next_u32() as usize)
        })],
        ProcessKind::All => (0..NUM_WORKERS)
            .map(|worker_num| thread::spawn(move || worker_task(worker_num)))
            .collect::<Vec<_>>(),
        _ => Vec::new(),
    };

    match use_broker {
        ProcessKind::Client | ProcessKind::All => {
            let clients = (0..NUM_CLIENTS)
                .map(|client_num| {
                    if client_num % BATCH_SIZE == 0 {
                        println!("Sleeping to avoid too many open files");
                        thread::sleep(Duration::from_millis(50));
                    }
                    thread::spawn(move || client_task(client_num))
                })
                .collect::<Vec<_>>();

            // Wait for clients to finish
            for client in clients {
                client.join().unwrap();
            }

            // Set up control socket
            let context = Arc::new(zmq::Context::new());
            let control_fut = Pub::builder(context).bind("tcp://*:5674").build();

            thread::sleep(Duration::from_secs(1));

            // Signal end when all clients have joined
            tokio::run(
                control_fut
                    .and_then(|control| control.send(zmq::Message::new().into()))
                    .map(|_| ())
                    .or_else(|e| {
                        println!("Error in main loop {}, {:?}", e, e);
                        Ok(())
                    }),
            );
        }
        _ => (),
    };

    for worker in workers {
        let worker_num = worker.join().unwrap();
        println!("Joined Worker {}", worker_num);
    }

    if let Some(broker_thread) = broker_thread {
        broker_thread.join().unwrap();
        println!("Joined Broker");
    }
}
