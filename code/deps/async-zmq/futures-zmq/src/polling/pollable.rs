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

use std::{collections::VecDeque, mem::replace};

use async_zmq_types::Multipart;
use futures::sync::oneshot;
use log::{error, trace, warn};
use zmq::{Message, PollEvents, PollItem, Socket, DONTWAIT, POLLIN, POLLOUT, SNDMORE};

use super::Response;

pub(crate) struct Pollable {
    sock: Socket,
    id: usize,
    kind: PollKind,
    outbound_message_buffer: VecDeque<Multipart>,
    inbound_message_cache: Multipart,
    send_responder: Option<oneshot::Sender<Response>>,
    recv_responder: Option<oneshot::Sender<Response>>,
}

impl Pollable {
    pub(crate) fn new(sock: Socket, id: usize) -> Self {
        Pollable {
            sock,
            id,
            kind: PollKind::UNUSED,
            outbound_message_buffer: VecDeque::new(),
            inbound_message_cache: Multipart::new(),
            send_responder: None,
            recv_responder: None,
        }
    }

    pub(crate) fn id(&self) -> usize {
        self.id
    }

    pub(crate) fn send_responder(&mut self) -> Option<oneshot::Sender<Response>> {
        self.send_responder.take()
    }

    pub(crate) fn recv_responder(&mut self) -> Option<oneshot::Sender<Response>> {
        self.recv_responder.take()
    }

    pub(crate) fn as_poll_item(&self) -> PollItem {
        self.sock.as_poll_item(self.kind.as_events())
    }

    pub(crate) fn is_readable(&self, poll_item: &PollItem) -> bool {
        self.kind.is_read() && poll_item.is_readable()
    }

    pub(crate) fn is_writable(&self, poll_item: &PollItem) -> bool {
        self.kind.is_write() && poll_item.is_writable()
    }

    pub(crate) fn read(&mut self) {
        trace!("Setting read, {}", self.id);
        self.kind.read();
    }

    pub(crate) fn clear_read(&mut self) {
        trace!("Clearing read, {}", self.id);
        self.kind.clear_read();
    }

    pub(crate) fn write(&mut self) {
        trace!("Setting write, {}", self.id);
        self.kind.write();
    }

    pub(crate) fn clear_write(&mut self) {
        trace!("Clearing write, {}", self.id);
        self.kind.clear_write();
    }

    pub(crate) fn queue_message(&mut self, multipart: Multipart) -> Option<Multipart> {
        if self.outbound_message_buffer.len() < 30 {
            self.outbound_message_buffer.push_back(multipart);
            None
        } else {
            Some(multipart)
        }
    }

    pub(crate) fn set_send_responder(&mut self, r: oneshot::Sender<Response>) {
        if self.send_responder.is_some() {
            panic!("Overwriting an existing responder, {}", self.id);
        }
        self.send_responder = Some(r);
    }

    pub(crate) fn set_recv_responder(&mut self, r: oneshot::Sender<Response>) {
        if self.recv_responder.is_some() {
            panic!("Overwriting an existing responder, {}", self.id);
        }
        self.recv_responder = Some(r);
    }

    pub(crate) fn try_recieve_message(&mut self) -> Result<Option<Message>, zmq::Error> {
        match self.sock.recv_msg(DONTWAIT) {
            Ok(msg) => Ok(Some(msg)),
            Err(zmq::Error::EAGAIN) => {
                warn!("EAGAIN while receiving, {}", self.id);
                Ok(None)
            }
            Err(e) => Err(e),
        }
    }

    pub(crate) fn try_receive_multipart(&mut self) -> Result<Option<Multipart>, zmq::Error> {
        while let Some(msg) = self.try_recieve_message()? {
            if msg.get_more() {
                self.inbound_message_cache.push_back(msg);
                continue;
            }

            self.inbound_message_cache.push_back(msg);
            let multipart = replace(&mut self.inbound_message_cache, Multipart::new());

            return Ok(Some(multipart));
        }

        if !self.inbound_message_cache.is_empty() {
            warn!("EAGAIN in the middle of a multipart, {}", self.id);
        }

        Ok(None)
    }

    pub(crate) fn fetch_multiparts(&mut self) {
        if let Some(responder) = self.recv_responder.take() {
            match self.try_receive_multipart() {
                Ok(Some(multipart)) => {
                    self.clear_read();

                    if let Err(_) = responder.send(Response::Received(multipart)) {
                        error!("Error responding with Received, {}", self.id);
                    }
                }
                Ok(None) => {
                    self.recv_responder = Some(responder);
                }
                Err(zmq::Error::EFSM) => {
                    warn!("EFSM while receiving, {}", self.id);
                    self.recv_responder = Some(responder);
                }
                Err(e) => {
                    self.clear_read();

                    error!("Error fetching, {}, {}", self.id, e);
                    if let Err(_) = responder.send(Response::Error(e.into())) {
                        error!("Error responding with Error, {}", self.id);
                    }
                }
            }
        }
    }

    pub(crate) fn try_send_message(
        &self,
        message: Message,
        flags: i32,
    ) -> Result<Option<Message>, zmq::Error> {
        let msg_clone = Message::from_slice(&message);

        match self.sock.send(message, flags) {
            Ok(_) => {
                trace!("SENT msg, {}", self.id);
                Ok(None)
            }
            Err(zmq::Error::EAGAIN) => {
                warn!("EAGAIN while sending, {}", self.id);
                Ok(Some(msg_clone))
            }
            Err(e) => Err(e),
        }
    }

    pub(crate) fn try_send_multipart(
        &self,
        mut multipart: Multipart,
    ) -> Result<Option<Multipart>, zmq::Error> {
        while let Some(msg) = multipart.pop_front() {
            let flags = DONTWAIT | if multipart.is_empty() { 0 } else { SNDMORE };

            if let Some(msg) = self.try_send_message(msg, flags)? {
                multipart.push_front(msg);
                return Ok(Some(multipart));
            }
        }

        Ok(None)
    }

    pub(crate) fn flush_multiparts(&mut self) {
        while let Some(multipart) = self.outbound_message_buffer.pop_front() {
            match self.try_send_multipart(multipart) {
                Ok(Some(multipart)) => {
                    self.outbound_message_buffer.push_front(multipart);
                    return;
                }
                Ok(None) => {
                    if let Some(responder) = self.send_responder.take() {
                        if let Err(_) = responder.send(Response::Sent) {
                            error!("Error responding with Sent, {}", self.id);
                        }
                    }
                    if self.outbound_message_buffer.is_empty() {
                        self.clear_write();
                        return;
                    }
                    continue;
                }
                Err(zmq::Error::EFSM) => {
                    warn!("EFSM while sending, {}", self.id);
                    return;
                }
                Err(e) => {
                    self.clear_write();

                    error!("Error flushing, {}, {}", self.id, e);
                    if let Some(responder) = self.send_responder.take() {
                        if let Err(_) = responder.send(Response::Error(e.into())) {
                            error!("Error responding with Error, {}", self.id);
                        }
                    }
                    return;
                }
            }
        }
    }
}

pub(crate) enum PollKind {
    SendMsg,
    RecvMsg,
    SendRecv,
    UNUSED,
}

impl PollKind {
    pub(crate) fn as_events(&self) -> PollEvents {
        match *self {
            PollKind::SendMsg => POLLOUT,
            PollKind::RecvMsg => POLLIN,
            PollKind::SendRecv => POLLIN | POLLOUT,
            _ => PollEvents::empty(),
        }
    }

    pub(crate) fn is_read(&self) -> bool {
        self.as_events() & POLLIN == POLLIN
    }

    pub(crate) fn is_write(&self) -> bool {
        self.as_events() & POLLOUT == POLLOUT
    }

    pub(crate) fn read(&mut self) {
        match *self {
            PollKind::SendMsg => *self = PollKind::SendRecv,
            _ => *self = PollKind::RecvMsg,
        }
    }

    pub(crate) fn clear_read(&mut self) {
        match *self {
            PollKind::SendRecv | PollKind::SendMsg => *self = PollKind::SendMsg,
            _ => *self = PollKind::UNUSED,
        }
    }

    pub(crate) fn write(&mut self) {
        match *self {
            PollKind::RecvMsg => *self = PollKind::SendRecv,
            _ => *self = PollKind::SendMsg,
        }
    }

    pub(crate) fn clear_write(&mut self) {
        match *self {
            PollKind::SendRecv | PollKind::RecvMsg => *self = PollKind::RecvMsg,
            _ => *self = PollKind::UNUSED,
        }
    }
}
