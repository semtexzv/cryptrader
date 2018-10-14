use prelude::*;


pub trait ServiceInfo {
    type REQ: mq::MultipartMsg + Debug;
    type REP: mq::MultipartMsg + Debug;
    const ENDPOINT: &'static str;
}

pub struct Service<I: ServiceInfo> {
    ctx: zmq::Context,
    sock: zmq::Socket,
    _p: ::std::marker::PhantomData<I>,
}

/// Asynchronous service endpoint. This struct uses ROUTER zmq socket
/// to receive and reply to requests. It also receives adresses, which are used
/// to route responses.
impl<I: ServiceInfo> Service<I> {
    pub fn new(ctx: zmq::Context) -> Result<Service<I>> {
        let mut sock = ctx.socket(zmq::SocketType::ROUTER)?;
        sock.bind(I::ENDPOINT)?;
        Ok(Service {
            ctx,
            sock,
            _p: ::std::marker::PhantomData,
        })
    }
    pub fn request(&self) -> Result<(mq::Address, I::REQ)> {
        let mut msg = self.sock.recv_mp()?;
        if msg.count() < 3 {
            bail!("Not enough frames, verify that you are using REQ socket")
        }
        let mut add = Vec::from(msg.pop_front().unwrap().deref());
        let _ = msg.pop_front();
        Ok((add, I::REQ::decode(&msg)?))
    }
    pub fn reply(&self, add: mq::Address, rep: I::REP) -> Result<()> {
        let mut msg = rep.encode()?;
        msg.push_front(zmq::Message::from(&[][..]));
        msg.push_front(zmq::Message::from(&add));
        self.sock.send_mp(msg)?;
        Ok(())
    }
    pub fn as_poll_item(&self, events: zmq::PollEvents) -> zmq::PollItem {
        return self.sock.as_poll_item(events);
    }
    pub fn as_rd_poll_item(&self) -> zmq::PollItem {
        return self.as_poll_item(zmq::POLLIN);
    }
}