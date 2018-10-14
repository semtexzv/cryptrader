use prelude::*;
use super::proxy::{ProxyInfo, WorkerMessage};
use mq::{SocketExt, MultipartMsg};

pub struct ServiceWorker<I: ProxyInfo> {
    ctx: zmq::Context,
    socket: zmq::Socket,
    _p: PhantomData<I>,
}

impl<I: ProxyInfo> ServiceWorker<I> {
    pub fn new(ctx: zmq::Context) -> Result<Self> {
        return ServiceWorker::new_filtered(ctx, ".*");
    }
    pub fn new_filtered(ctx: zmq::Context, filter: impl Into<String>) -> Result<Self> {
        let mut sock = ctx.socket(zmq::SocketType::REQ)?;
        sock.connect(I::WORKER_ENDPOINT)?;


        let mut msg: WorkerMessage<I> = WorkerMessage::RegisterAvailability(filter.into());
        let mut data = msg.encode()?;
        sock.send_mp(data)?;

        Ok(ServiceWorker {
            ctx,
            socket: sock,
            _p: PhantomData,
        })
    }
    pub fn request(&self) -> Result<I::REQ> {
        return Ok(I::REQ::decode(&self.socket.recv_mp()?)?);
    }
    pub fn reply(&self, rep: I::REP) -> Result<()> {
        let mut msg: WorkerMessage<I> = WorkerMessage::Reply(rep);
        let mut mp = msg.encode()?;
        self.socket.send_mp(mp)?;
        Ok(())
    }
}
