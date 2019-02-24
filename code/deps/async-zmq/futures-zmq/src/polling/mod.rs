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

#[cfg(unix)]
use std::os::unix::io::{AsRawFd, RawFd};
#[cfg(windows)]
use std::os::windows::io::{AsRawSocket, RawSocket};

use std::{
    fmt,
    io::{self, Read, Write},
    net::{TcpListener, TcpStream},
    sync::{mpsc, Arc, Mutex},
    thread,
};

use async_zmq_types::Multipart;
use futures::{executor::Notify, sync::oneshot, Async, Future, Poll};
use log::{error, info, trace};
use zmq::Socket;

use crate::error::Error;

mod poll_thread;
mod pollable;

use self::{poll_thread::PollThread, pollable::Pollable};

pub struct SockId(usize, Arc<Mutex<SockIdInner>>);

impl SockId {
    fn new(id: usize, tx: Sender) -> Self {
        SockId(id, Arc::new(Mutex::new(SockIdInner(id, tx))))
    }
}

impl fmt::Debug for SockId {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "SockId({}, _)", self.0)
    }
}

impl fmt::Display for SockId {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.0)
    }
}

struct SockIdInner(usize, Sender);

impl Drop for SockIdInner {
    fn drop(&mut self) {
        trace!("Dropping {}", self.0);
        let _ = self.1.send(Request::DropSocket(self.0));
    }
}

pub(crate) enum Request {
    Init(Socket, oneshot::Sender<SockId>),
    SendMessage(usize, Multipart, oneshot::Sender<Response>),
    ReceiveMessage(usize, oneshot::Sender<Response>),
    DropSocket(usize),
    Done,
}

pub(crate) enum Response {
    Sent,
    Received(Multipart),
    Full(Multipart),
    Error(Error),
}

struct Channel {
    tx: TcpStream,
    rx: TcpStream,
}

impl Channel {
    fn notify(&self) {
        self.drain();

        if let Err(e) = (&self.tx).write(&[1]) {
            error!("Error notifying channel, {}", e);
        }
    }

    fn drain(&self) -> bool {
        let mut new_data = false;
        loop {
            match (&self.rx).read(&mut [0; 32]) {
                Ok(_) => {
                    new_data = true;
                }
                Err(ref e) if e.kind() == io::ErrorKind::WouldBlock => break,
                Err(e) => panic!("I/O error: {}", e),
            }
        }
        new_data
    }

    #[cfg(unix)]
    fn read_fd(&self) -> RawFd {
        self.rx.as_raw_fd()
    }

    #[cfg(windows)]
    fn read_fd(&self) -> RawSocket {
        self.rx.as_raw_socket()
    }
}

#[derive(Clone)]
pub(crate) struct Sender {
    tx: mpsc::Sender<Request>,
    channel: Arc<Channel>,
}

impl Sender {
    fn send(&self, request: Request) {
        if let Err(_) = self.tx.send(request) {
            error!("Error sending request");
        }
        self.channel.notify();
    }
}

pub(crate) struct Receiver {
    rx: mpsc::Receiver<Request>,
    channel: Arc<Channel>,
}

impl Receiver {
    fn try_recv(&self) -> Option<Request> {
        self.rx.try_recv().ok()
    }

    /// Returns whether there are messages to look at
    fn drain(&self) -> bool {
        self.channel.drain()
    }
}

/// A local copy of Session
///
/// This is useful so we don't invoke mutex locks to send commands to the poll thread
pub struct LocalSession {
    sender: Sender,
    #[allow(dead_code)]
    session: Session,
}

impl LocalSession {
    pub fn send(&self, id: &SockId, msg: Multipart) -> SendFuture {
        let (tx, rx) = oneshot::channel();

        self.sender.send(Request::SendMessage(id.0, msg, tx));

        SendFuture { rx }
    }

    pub fn recv(&self, id: &SockId) -> RecvFuture {
        let (tx, rx) = oneshot::channel();

        self.sender.send(Request::ReceiveMessage(id.0, tx));

        RecvFuture { rx }
    }

    pub fn init(&self, sock: Socket) -> InitFuture {
        let (tx, rx) = oneshot::channel();

        self.sender.send(Request::Init(sock, tx));

        InitFuture { rx }
    }
}

#[derive(Clone)]
pub struct Session {
    inner: Arc<Mutex<Option<InnerSession>>>,
}

impl Session {
    pub fn new() -> Self {
        let listener = TcpListener::bind("127.0.0.1:0").unwrap();
        let addr = listener.local_addr().unwrap();

        let conn1 = TcpStream::connect(&addr).unwrap();
        let conn2 = listener.accept().unwrap().0;

        drop(listener);

        conn1.set_nonblocking(true).unwrap();
        conn2.set_nonblocking(true).unwrap();

        let channel = Arc::new(Channel {
            tx: conn1,
            rx: conn2,
        });

        let (tx, rx) = mpsc::channel();

        let tx = Sender {
            tx: tx.clone(),
            channel: channel.clone(),
        };
        let rx = Receiver {
            rx: rx,
            channel: channel,
        };

        let tx2 = tx.clone();

        thread::spawn(move || {
            PollThread::new(tx2, rx).run();
        });

        Session {
            inner: InnerSession::init(tx),
        }
    }

    pub fn shutdown(&self) {
        *self.inner.lock().unwrap() = None;
    }

    pub fn local_session(&self) -> LocalSession {
        let session = self.clone();
        let sender = self.inner.lock().unwrap().as_ref().unwrap().tx.clone();

        LocalSession { sender, session }
    }
}

pub struct SendFuture {
    rx: oneshot::Receiver<Response>,
}

impl Future for SendFuture {
    type Item = Option<Multipart>;
    type Error = Error;

    fn poll(&mut self) -> Poll<Self::Item, Self::Error> {
        match self.rx.poll()? {
            Async::Ready(res) => match res {
                Response::Sent => Ok(Async::Ready(None)),
                Response::Full(msg) => Ok(Async::Ready(Some(msg))),
                Response::Error(e) => Err(e),
                _ => panic!("Response kind was not sent"),
            },
            Async::NotReady => Ok(Async::NotReady),
        }
    }
}

pub struct RecvFuture {
    rx: oneshot::Receiver<Response>,
}

impl Future for RecvFuture {
    type Item = Multipart;
    type Error = Error;

    fn poll(&mut self) -> Poll<Self::Item, Self::Error> {
        match self.rx.poll()? {
            Async::Ready(res) => match res {
                Response::Received(msg) => Ok(Async::Ready(msg)),
                Response::Error(e) => Err(e),
                _ => panic!("Response kind was not received"),
            },
            Async::NotReady => Ok(Async::NotReady),
        }
    }
}

pub struct InitFuture {
    rx: oneshot::Receiver<SockId>,
}

impl Future for InitFuture {
    type Item = SockId;
    type Error = Error;

    fn poll(&mut self) -> Poll<Self::Item, Self::Error> {
        Ok(self.rx.poll()?)
    }
}

struct InnerSession {
    tx: Sender,
}

impl InnerSession {
    fn init(tx: Sender) -> Arc<Mutex<Option<Self>>> {
        Arc::new(Mutex::new(Some(InnerSession { tx })))
    }
}

impl Drop for InnerSession {
    fn drop(&mut self) {
        info!("Dropping session");
        self.tx.send(Request::Done);
    }
}

#[derive(Clone)]
struct NotifyCanceled {
    channel: Arc<Channel>,
}

impl NotifyCanceled {
    fn new(channel: Arc<Channel>) -> Self {
        NotifyCanceled { channel }
    }
}

impl Notify for NotifyCanceled {
    fn notify(&self, _id: usize) {
        self.channel.notify();
    }
}

struct CheckCanceled<'a> {
    sender: &'a mut oneshot::Sender<Response>,
}

impl<'a> Future for CheckCanceled<'a> {
    type Item = ();
    type Error = ();

    fn poll(&mut self) -> Poll<(), ()> {
        self.sender.poll_cancel()
    }
}
