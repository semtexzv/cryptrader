#![feature(try_blocks)]

use log::{info, debug};
use futures::prelude::*;
use failure::Fail;
use zmq::Message;
use tokio::reactor::PollEvented2;

mod mp;
mod poll;
mod fut;

use mp::*;
use fut::*;
use std::fmt::Debug;
use std::rc::Rc;
use std::sync::Arc;

#[derive(Debug, Fail)]
pub enum Error {
    #[fail(display = "io error: {}", 0)]
    Io(std::io::Error),
    #[fail(display = "zmq error: {}", 0)]
    Zmq(zmq::Error),
}

impl From<std::io::Error> for Error {
    fn from(e: std::io::Error) -> Self {
        Error::Io(e)
    }
}

impl From<zmq::Error> for Error {
    fn from(e: zmq::Error) -> Self {
        Error::Zmq(e)
    }
}

pub struct EventedSocket(pub(crate) zmq::Socket);

impl Debug for EventedSocket {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        f.debug_struct("EventedSocket").finish()
    }
}

#[derive(Debug)]
pub struct Socket(pub(crate) PollEvented2<EventedSocket>);

unsafe impl Sync for Socket {}

impl Socket {
    pub fn from_raw(sock: zmq::Socket) -> Self {
        return Socket(PollEvented2::new(EventedSocket(sock)));
    }
    pub(crate) fn zmq_sock(&self) -> &zmq::Socket {
        &self.0.get_ref().0
    }
    pub fn into_sink_stream(self) -> (SocketSink, SocketStream) {
        let rc = Arc::new(self);
        let sink = SocketSink::from_raw(rc.clone());
        let stream = SocketStream::from_raw(rc);

        (sink, stream)
    }
}

#[cfg(test)]
pub mod test {
    use super::*;
    use std::time::Instant;
    use std::time::Duration;

    type BoxStream<I, E> = Box<Stream<Item=I, Error=E> + Send>;

    type BoxFuture<I, E> = Box<Future<Item=I, Error=E> + Send>;

    #[test]
    fn test_basic_pubsub() -> Result<(), failure::Error> {
        simplelog::SimpleLogger::init(log::LevelFilter::Debug, Default::default()).unwrap();
        let x: Result<(), failure::Error> = try {
            let ctx = zmq::Context::new();
            let publ = ctx.socket(zmq::PUB)?;
            publ.bind("ipc://abc")?;

            let subs = ctx.socket(zmq::SUB)?;
            subs.set_subscribe(&[]);
            subs.connect("ipc://abc")?;

            let publisher = Socket::from_raw(publ);
            let subscriber = Socket::from_raw(subs);

            let (tx, _) = publisher.into_sink_stream();
            let (_, rx) = subscriber.into_sink_stream();

            let mut i = 0;
            let stream: BoxStream<_, failure::Error> = Box::new(rx.from_err::<failure::Error>().and_then(|item| {
                tokio_timer::Delay::new(Instant::now() + Duration::from_secs(1))
                    .map(|_| {
                        println!("Item :{:?}", item);
                        item
                    })
                    .map_err(Into::into)
            }));

            let ff: BoxFuture<(), failure::Error> = Box::new(tx.send(Multipart::from(Message::from("Hello")))
                .from_err()
                .and_then(|tx| {
                    tx.sink_from_err::<failure::Error>().send_all(stream)
                        .from_err()
                        .map(|_| ())
                }));

            tokio::run(ff.then(|x| {
                x.unwrap();
                futures::future::ok(())
            }));
        };
        x.unwrap();
        Ok(())
    }
}