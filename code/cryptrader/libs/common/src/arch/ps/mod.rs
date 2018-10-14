use prelude::*;
use ::std::marker::PhantomData;

/// Trait describing pubsub topology.
pub trait FanOp {
    /// operation to connect/bind this [sock] to provided [uri] on the publish side
    fn pub_socket_op(sock: &mut zmq::Socket, uri: &str) -> Result<()>;
    /// operation to connect/bind this [sock] to provided [uri] on the subscribe side
    fn sub_socket_op(sock: &mut zmq::Socket, uri: &str) -> Result<()>;
}

/// Unit struct providing [FanOp] for topologies with multiple publishers and one subscriber
pub struct FanIn;

impl FanOp for FanIn {
    fn pub_socket_op(sock: &mut zmq::Socket, uri: &str) -> Result<()> {
        Ok(sock.connect(uri)?)
    }
    fn sub_socket_op(sock: &mut zmq::Socket, uri: &str) -> Result<()> {
        Ok(sock.bind(uri)?)
    }
}

/// Unit struct providing [FanOp] for topologies with multiple subscribers and one publisher
pub struct FanOut;

impl FanOp for FanOut {
    fn pub_socket_op(sock: &mut zmq::Socket, uri: &str) -> Result<()> {
        Ok(sock.bind(uri)?)
    }
    fn sub_socket_op(sock: &mut zmq::Socket, uri: &str) -> Result<()> {
        Ok(sock.connect(uri)?)
    }
}


pub trait StageInfo {
    const ENDPOINT: &'static str;
    type Msg: mq::MultipartMsg;
    type FanOpType: FanOp;
}


pub struct Publisher<I: StageInfo> {
    ctx: zmq::Context,
    sock: zmq::Socket,
    _p: PhantomData<I>,
}

impl<I: StageInfo> Publisher<I> {
    pub fn new(ctx: zmq::Context) -> Result<Self> {
        let mut sock = ctx.socket(zmq::SocketType::PUB)?;
        I::FanOpType::pub_socket_op(&mut sock, I::ENDPOINT)?;

        Ok(Publisher {
            ctx,
            sock,
            _p: PhantomData,
        })
    }
    pub fn send(&mut self, data : &I::Msg) -> Result<()> {
        let mut data = data.encode()?;
        self.sock.send_mp(data)?;
        Ok(())
    }
}

pub struct Subscriber<I: StageInfo> {
    ctx: zmq::Context,
    sock: zmq::Socket,
    _p: PhantomData<I>,
}


impl<I: StageInfo> Subscriber<I> {
    pub fn new(ctx: zmq::Context) -> Result<Self> {
        let mut sock = ctx.socket(zmq::SocketType::SUB)?;
        I::FanOpType::sub_socket_op(&mut sock, I::ENDPOINT)?;
        sock.set_subscribe(b"")?;

        Ok(Subscriber {
            ctx,
            sock,
            _p: PhantomData,
        })
    }
    pub fn recv(&mut self) -> Result<I::Msg> {
        let mut data = self.sock.recv_mp()?;
        I::Msg::decode(&data)
    }
}