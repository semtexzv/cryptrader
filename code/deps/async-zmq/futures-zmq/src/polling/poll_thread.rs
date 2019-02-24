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

use std::{collections::BTreeMap, sync::Arc};

use futures::{executor, sync::oneshot, Async};
use log::{error, info, trace};
use zmq::{poll, PollItem, POLLIN};

use super::{
    Channel, CheckCanceled, Error, NotifyCanceled, Pollable, Receiver, Request, Response, Sender,
    SockId,
};

enum Action {
    Snd(usize),
    Rcv(usize),
}

pub(crate) struct PollThread {
    next_sock_id: usize,
    tx: Sender,
    rx: Receiver,
    should_stop: bool,
    to_action: Vec<Action>,
    notify: Arc<NotifyCanceled>,
    sockets: BTreeMap<usize, Pollable>,
    channel: Arc<Channel>,
}

impl PollThread {
    pub(crate) fn new(tx: Sender, rx: Receiver) -> Self {
        let channel = rx.channel.clone();

        PollThread {
            next_sock_id: 0,
            tx,
            rx,
            should_stop: false,
            to_action: Vec::new(),
            notify: Arc::new(NotifyCanceled::new(channel.clone())),
            sockets: BTreeMap::new(),
            channel,
        }
    }

    pub(crate) fn run(&mut self) {
        loop {
            self.turn();
        }
    }

    fn try_recv(&mut self) {
        while let Some(msg) = self.rx.try_recv() {
            if !self.should_stop {
                self.handle_request(msg);
            } else {
                self.respond_stopping(msg);
            }
        }
        self.rx.drain();
    }

    fn respond_stopping(&mut self, request: Request) {
        match request {
            Request::Init(_, responder) => {
                let id = self.next_sock_id;

                if let Err(_) = responder.send(SockId::new(id, self.tx.clone())) {
                    error!("Error responding with init socket, {}", id);
                }

                self.next_sock_id += 1;
            }
            Request::SendMessage(id, _, responder) => {
                if let Err(_) = responder.send(Response::Error(Error::Dropped)) {
                    error!("Error responding with dropped, {}", id);
                }
            }
            Request::ReceiveMessage(id, responder) => {
                if let Err(_) = responder.send(Response::Error(Error::Dropped)) {
                    error!("Error responding with dropped, {}", id);
                }
            }
            Request::DropSocket(id) => {
                if let Some(mut pollable) = self.sockets.remove(&id) {
                    if let Some(responder) = pollable.send_responder() {
                        if let Err(_) = responder.send(Response::Error(Error::Dropped)) {
                            error!("Error notifying dropped socket, {}", id);
                        }
                    }

                    if let Some(responder) = pollable.recv_responder() {
                        if let Err(_) = responder.send(Response::Error(Error::Dropped)) {
                            error!("Error notifying dropped socket, {}", id);
                        }
                    }
                }
            }
            Request::Done => {
                info!("Handling done");
                self.should_stop = true;
            }
        }
    }

    fn handle_request(&mut self, request: Request) {
        match request {
            Request::Init(sock, responder) => {
                let id = self.next_sock_id;

                self.sockets.insert(id, Pollable::new(sock, id));
                if let Err(_) = responder.send(SockId::new(id, self.tx.clone())) {
                    error!("Error responding with init socket, {}", id);
                }

                self.next_sock_id += 1;
            }
            Request::SendMessage(id, message, responder) => {
                if let Some(pollable) = self.sockets.get_mut(&id) {
                    if let Some(message) = pollable.queue_message(message) {
                        trace!("Buffer full, flushing, {}", pollable.id());
                        pollable.flush_multiparts();

                        if let Some(msg) = pollable.queue_message(message) {
                            trace!("Buffer full, {}", id);
                            if let Err(_) = responder.send(Response::Full(msg)) {
                                error!("Error notifying of full buffer, {}", id);
                            }
                            return;
                        }
                    }
                    pollable.write();
                    pollable.set_send_responder(responder);
                    pollable.flush_multiparts();
                } else {
                    error!("Tried to send to dropped socket, {}", id);
                    if let Err(_) = responder.send(Response::Error(Error::Dropped)) {
                        error!("Error responding with dropped, {}", id);
                    }
                }
            }
            Request::ReceiveMessage(id, responder) => {
                if let Some(pollable) = self.sockets.get_mut(&id) {
                    pollable.set_recv_responder(responder);
                    pollable.read();
                    pollable.fetch_multiparts();
                } else {
                    error!("Tried to receive from dropped socket, {}", id);
                    if let Err(_) = responder.send(Response::Error(Error::Dropped)) {
                        error!("Error responding with dropped, {}", id);
                    }
                }
            }
            Request::DropSocket(id) => {
                if let Some(mut pollable) = self.sockets.remove(&id) {
                    if let Some(responder) = pollable.send_responder() {
                        if let Err(_) = responder.send(Response::Error(Error::Dropped)) {
                            error!("Error notifying dropped socket, {}", id);
                        }
                    }

                    if let Some(responder) = pollable.recv_responder() {
                        if let Err(_) = responder.send(Response::Error(Error::Dropped)) {
                            error!("Error notifying dropped socket, {}", id);
                        }
                    }
                }
            }
            Request::Done => {
                info!("Handling done");
                self.should_stop = true;
            }
        }
    }

    fn check_responder(
        notify: &Arc<NotifyCanceled>,
        sender: &mut oneshot::Sender<Response>,
    ) -> bool {
        let mut cancel_check = executor::spawn(CheckCanceled { sender });

        if let Ok(Async::Ready(())) = cancel_check.poll_future_notify(notify, 0) {
            true
        } else {
            false
        }
    }

    fn drop_inactive(&mut self) {
        for ref mut pollable in self.sockets.values_mut() {
            if let Some(mut responder) = pollable.recv_responder() {
                let to_clear = Self::check_responder(&self.notify, &mut responder);

                if !to_clear {
                    pollable.set_recv_responder(responder);
                }
            }

            if let Some(mut responder) = pollable.send_responder() {
                let to_clear = Self::check_responder(&self.notify, &mut responder);

                if !to_clear {
                    pollable.set_send_responder(responder);
                }
            }
        }
    }

    fn poll(&mut self) {
        self.to_action.truncate(0);

        let (ids, mut poll_items): (Vec<_>, Vec<_>) = self
            .sockets
            .iter()
            .map(|(id, pollable)| (id, pollable.as_poll_item()))
            .unzip();

        let io_item = PollItem::from_fd(self.channel.read_fd(), POLLIN);

        poll_items.push(io_item);

        let res = if self.channel.drain() {
            poll(&mut poll_items, 0)
        } else {
            poll(&mut poll_items, 50)
        };

        let _num_signalled = match res {
            Ok(num) => num,
            Err(e) => {
                error!("Error in poll, {}", e);
                return;
            }
        };

        for (id, item) in ids.into_iter().zip(poll_items) {
            // Prioritize outbound messages over inbound messages
            if self
                .sockets
                .get(&id)
                .map(|p| p.is_writable(&item))
                .unwrap_or(false)
            {
                trace!("{} write ready", id);
                self.to_action.push(Action::Snd(id));
            }

            if self
                .sockets
                .get(&id)
                .map(|p| p.is_readable(&item))
                .unwrap_or(false)
            {
                trace!("{} read ready", id);
                self.to_action.push(Action::Rcv(id));
            }
        }

        for action in self.to_action.drain(..).rev() {
            match action {
                Action::Rcv(id) => {
                    self.sockets
                        .get_mut(&id)
                        .map(|pollable| pollable.fetch_multiparts());
                }
                Action::Snd(id) => {
                    self.sockets
                        .get_mut(&id)
                        .map(|pollable| pollable.flush_multiparts());
                }
            }
        }
    }

    fn turn(&mut self) {
        self.drop_inactive();
        self.try_recv();
        self.poll();
    }
}
