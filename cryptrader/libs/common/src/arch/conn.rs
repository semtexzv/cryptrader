use ::prelude::*;
use mq::{self, MultipartMsg, Multipart, SocketExt};
use svc_types;

use super::service::ServiceInfo;

pub struct ServiceConn<I: ServiceInfo> {
    ctx: zmq::Context,
    socket: zmq::Socket,
    req: Option<I::REQ>,
}

impl<I: ServiceInfo> ServiceConn<I> {
    pub fn new() -> Result<Self> {
        let mut ctx = ::ZMQ_CONTEXT.clone();
        let mut socket = ctx.socket(zmq::SocketType::DEALER)?;
        socket.connect(I::ENDPOINT)?;

        Ok(ServiceConn {
            ctx,
            socket,
            req: None,
        })
    }

    pub fn as_poll_item(&self, events: zmq::PollEvents) -> zmq::PollItem {
        return self.socket.as_poll_item(events);
    }
    pub fn request(&mut self, q: impl Into<I::REQ>) -> Result<()> {
        let mut q = q.into();

        let mut msg = q.encode()?;
        msg.push_front(zmq::Message::from_slice(&[]));
        self.socket.send_mp(msg)?;
        self.req = Some(q);
        Ok(())
    }
    pub fn get(&mut self) -> Result<I::REP> {
        let mut poll = {
            let mut poll = self.socket.as_poll_item(zmq::POLLIN);
            // Wait max 15 secs for result;
            let mut timeout = 1000 * 1000;
            let mut items = [poll];
            zmq::poll(&mut items, timeout)?;
            items[0].is_readable()
        };
        if poll {
            let mut data = self.socket.recv_mp()?;
            let _ = data.pop_front();

            let mut data = I::REP::decode(&data)?;
            self.req = None;
            return Ok(data);
        }
        bail!("Timed out")
    }
}


pub struct TickerSrcInfo;

impl ServiceInfo for TickerSrcInfo {
    const ENDPOINT: &'static str = mq::ENDPOINT_TICKER_SERVICE;
    type REQ = svc_types::ticker::TickerQuery;
    type REP = svc_types::ticker::TickerResponse;
}

pub struct WalletSrcInfo;

impl ServiceInfo for WalletSrcInfo {
    const ENDPOINT: &'static str = mq::ENDPOINT_EXCH_SERVICE;
    type REQ = svc_types::exch::WalletQuery;
    type REP = svc_types::exch::WalletReply;
}

pub struct ExchangeExecSrcInfo;

impl ServiceInfo for ExchangeExecSrcInfo {
    const ENDPOINT: &'static str = mq::ENDPOINT_EXCH_SERVICE;
    type REQ = svc_types::exch::ExchQuery;
    type REP = svc_types::exch::OrderReply;
}