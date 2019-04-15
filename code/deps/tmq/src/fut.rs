use log::{info, debug};
use futures::prelude::*;

use std::{
    fmt::Debug,
    collections::VecDeque,
    rc::Rc,
};

use crate::poll::*;
use crate::{
    Error, Socket,
    mp::Multipart,
};
use std::sync::Arc;


pub struct SocketStream {
    sock: Arc<Socket>,
    buffer: VecDeque<zmq::Message>,
}

impl SocketStream {
    pub(crate) fn from_raw(sock: Arc<Socket>) -> Self {
        Self {
            sock,
            buffer: Default::default(),
        }
    }
}

pub struct SocketSink {
    sock: Arc<Socket>,
    buffer: VecDeque<zmq::Message>,
}

impl SocketSink {
    pub(crate) fn from_raw(sock: Arc<Socket>) -> Self {
        Self {
            sock,
            buffer: Default::default(),
        }
    }
}

impl Stream for SocketStream {
    type Item = Multipart;
    type Error = Error;

    fn poll(&mut self) -> Result<Async<Option<Self::Item>>, Self::Error> {
        let mut msg = zmq::Message::new();

        loop {
            match self.sock.0.recv_msg(&mut msg)? {
                Async::Ready(()) => {
                    self.buffer.push_back(std::mem::replace(&mut msg, zmq::Message::new()));
                    if (self.sock.zmq_sock().get_rcvmore()? == false) {
                        let mp = std::mem::replace(&mut self.buffer, Default::default());
                        let mp = Multipart(mp);
                        return Ok(Async::Ready(Some(mp)));
                    }
                }
                Async::NotReady => {
                    return Ok(Async::NotReady);
                }
            }
        }
    }
}

impl Sink for SocketSink {
    type SinkItem = Multipart;
    type SinkError = Error;

    fn start_send(&mut self, item: Self::SinkItem) -> Result<AsyncSink<Self::SinkItem>, Self::SinkError> {
        if (!self.buffer.is_empty()) {
            return Ok(AsyncSink::NotReady(item));
        }
        self.buffer = item.into_inner();
        Ok(AsyncSink::Ready)
    }

    fn poll_complete(&mut self) -> Result<Async<()>, Self::SinkError> {
        while let Some(msg) = self.buffer.pop_front() {
            match self.sock.0.send_msg(&msg, self.buffer.is_empty())? {
                Async::NotReady => {
                    self.buffer.push_front(msg);
                    return Ok(Async::NotReady);
                }
                _ => {}
            }
        }
        return Ok(Async::Ready(()));
    }

    fn close(&mut self) -> Result<Async<()>, Self::SinkError> {
        Ok(Async::Ready(()))
    }
}
