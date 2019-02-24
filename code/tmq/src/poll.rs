mod a {
    use mio::{Evented, Token, Ready, PollOpt, Poll};
    use std::io;
    use mio::unix::EventedFd;

    impl mio::Evented for crate::EventedSocket {
        fn register(&self, poll: &Poll, token: Token, interest: Ready, opts: PollOpt) -> io::Result<()> {
            EventedFd(&self.0.get_fd()?).register(poll, token, interest, opts)
        }

        fn reregister(&self, poll: &Poll, token: Token, interest: Ready, opts: PollOpt) -> io::Result<()> {
            EventedFd(&self.0.get_fd()?).reregister(poll, token, interest, opts)
        }

        fn deregister(&self, poll: &Poll) -> io::Result<()> {
            EventedFd(&self.0.get_fd()?).deregister(poll)
        }
    }
}

pub use a::*;

use futures::prelude::*;
use tokio::reactor::PollEvented2;
use mio::Ready;
use crate::Error;
use zmq::Message;
use crate::EventedSocket;
use futures::task;


pub trait Poller {
    fn send_msg(&self, msg: &zmq::Message, last: bool) -> Poll<(), Error>;
    fn recv_msg(&self, msg: &mut zmq::Message) -> Poll<(), Error>;
}

impl Poller for PollEvented2<EventedSocket> {
    fn send_msg(&self, msg: &Message, last: bool) -> Result<Async<()>, Error> {
        if let Async::Ready(_) = self.poll_write_ready()? {
            let mut flags = zmq::DONTWAIT;
            if !last {
                flags |= zmq::SNDMORE
            }
            return match self.get_ref().0.send(&**msg, flags) {
                Ok(_) => {

                    Ok(Async::Ready(()))
                },
                Err(zmq::Error::EAGAIN) => {
                    self.clear_write_ready()?;
                    Ok(Async::NotReady)
                }
                Err(e) => Err(e.into())
            };
        }
        return Ok(Async::NotReady);
    }

    fn recv_msg(&self, msg: &mut Message) -> Result<Async<()>, Error> {
        let ready = Ready::readable();
        if let Async::Ready(_) = self.poll_read_ready(ready)? {
            return match self.get_ref().0.recv(msg, zmq::DONTWAIT) {
                Ok(_) => {
                    Ok(Async::Ready(()))
                },
                Err(zmq::Error::EAGAIN) => {
                    self.clear_read_ready(ready)?;
                    Ok(Async::NotReady)
                }
                Err(e) => Err(e.into())
            };
        }
        return Ok(Async::NotReady);
    }
}
