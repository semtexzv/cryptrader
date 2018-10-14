use prelude::*;

use ::zmq::{self, Context};
use std::error::Error as StdError;
use std;
use std::convert::TryInto;

pub const ENDPOINT_AGGR_IN: &str = "ipc:///tmp/aggr_in.ipc";
pub const ENDPOINT_AGGR_OUT: &str = "ipc:///tmp/aggr_out.ipc";

pub const ENDPOINT_TICKER_AGGR_IN: &str = "ipc:///tmp/ticker_aggr_in.ipc";
pub const ENDPOINT_TICKER_SERVICE: &str = "ipc:///tmp/ticker_srv.ipc";

pub const ENDPOINT_RESCALER_OUT: &str = "ipc:///tmp/rescaler_out.ipc";


pub const ENDPOINT_MATCHER_WORKERS: &str = "ipc:///tmp/matcher_workers.ipc";
pub const ENDPOINT_MATHCER_DECISIONS: &str = "ipc:///tmp/matcher_decisions.ipc";

pub const ENDPOINT_DBPROVIDER: &str = "ipc:///tmp/db_provider.ipc";
pub const ENDPOINT_DECISION_PUB: &str = "ipc:///tmp/decisions.ipc";

pub const ENDPOINT_EXCH_WORKERS: &str = "ipc:///tmp/exch_workers.ipc";
pub const ENDPOINT_EXCH_SERVICE: &str = "ipc:///tmp/exch_service.ipc";

pub const ENDPOINT_EVAL_SERVICE: &str = "ipc:///tmp/eval_service.ipc";
pub const ENDPOINT_EVAL_WORKERS: &str = "ipc:///tmp/eval_workers.ipc";


pub type Address = Vec<u8>;

#[derive(Debug)]
pub enum Error {
    NotEnoughMessages,
    TooManyMessages,
}

impl ::std::error::Error for Error {
    fn cause(&self) -> Option<&::std::error::Error> {
        None
    }
    fn description(&self) -> &str {
        match self {
            &Error::NotEnoughMessages => "Not enough frames".into(),
            &Error::TooManyMessages => "Too many frames".into(),
        }
    }
}


#[derive(Debug, Default)]
pub struct Multipart {
    inner: ::std::collections::VecDeque<zmq::Message>
}

impl Multipart {
    pub fn new() -> Self {
        Multipart::default()
    }
    pub fn into_inner(self) -> ::std::collections::VecDeque<zmq::Message> {
        self.inner
    }
    pub fn inner(&self) -> &::std::collections::VecDeque<zmq::Message> {
        &self.inner
    }
    pub fn get(&self, index: usize) -> Option<&zmq::Message> {
        self.inner.get(index)
    }
    pub fn pop_front(&mut self) -> Option<zmq::Message> {
        self.inner.pop_front()
    }
    pub fn pop_back(&mut self) -> Option<zmq::Message> {
        self.inner.pop_back()
    }
    pub fn push_front(&mut self, msg: zmq::Message) {
        self.inner.push_front(msg)
    }
    pub fn push_back(&mut self, msg: zmq::Message) {
        self.inner.push_back(msg)
    }

    pub fn push<T: Into<zmq::Message>>(&mut self, msg: T) {
        let mut m: zmq::Message = msg.into();
        self.inner.push_back(m)
    }

    pub fn is_empty(&self) -> bool {
        self.inner.is_empty()
    }

    #[must_use = "Goal of this function is to verify the number of frames"]
    pub fn len_eq(&self, expected: usize) -> StdResult<(), Error> {
        if self.count() < expected {
            return Err(Error::NotEnoughMessages);
        } else if self.count() > expected {
            return Err(Error::TooManyMessages);
        }
        return Ok(());
    }

    pub fn count(&self) -> usize {
        return self.inner.len();
    }
}


impl Deref for Multipart {
    type Target = ::std::collections::VecDeque<zmq::Message>;

    fn deref(&self) -> &Self::Target {
        return &self.inner;
    }
}

impl From<zmq::Message> for Multipart {
    fn from(msg: zmq::Message) -> Self {
        let mut multipart = Multipart::new();
        multipart.push_back(msg);
        multipart
    }
}


impl From<Vec<zmq::Message>> for Multipart {
    fn from(v: Vec<zmq::Message>) -> Self {
        Multipart { inner: v.into() }
    }
}


impl std::fmt::Display for Error {
    fn fmt(&self, f: &mut ::std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "{}", self.description())
    }
}


pub trait MultipartMsg: Sized {
    fn encode(&self) -> Result<Multipart>;
    fn decode(data: &Multipart) -> Result<Self>;
}


pub fn wire_encode<T: Serialize>(val: &T) -> Result<Vec<u8>> {
    Ok(json::to_vec(&val)?)
}

pub fn wire_decode<'de, T: Deserialize<'de>>(wire: &'de [u8]) -> Result<T> {
    Ok(json::from_slice(wire)?)
}

pub fn multipart_routable(addrs: &[&[u8]], data: &impl MultipartMsg) -> Result<Multipart> {
    let mut msg = data.encode()?;

    for addr in addrs.iter().rev() {
        // Pushing in inverse order
        msg.push_front(zmq::Message::from(&[][..]));
        msg.push_front(zmq::Message::from(addr));
    }

    Ok(msg)
}


pub trait AutoSimpleMultipart: Sized + Serialize + DeserializeOwned {
    fn path(&self) -> Option<String> {
        None
    }
}

impl<T: AutoSimpleMultipart> MultipartMsg for T
{
    fn encode(&self) -> Result<Multipart> {
        let mut mp = Multipart::new();
        if let Some(path) = self.path() {
            mp.push(zmq::Message::from(&path));
        }
        mp.push(wire_encode(&self)?);
        Ok(mp)
    }

    fn decode(mut data: &Multipart) -> Result<Self> {
        let _ = data.len_eq(1)?;
        let mut data = if data.count() == 1 {
            &data[0]
        } else {
            &data[1]
        };

        Ok(wire_decode(data)?)
    }
}

pub trait SocketExt {
    fn send_mp(&self, msg: Multipart) -> Result<()>;
    fn recv_mp(&self) -> Result<Multipart>;
}

impl SocketExt for zmq::Socket {
    fn send_mp(&self, mut msg: Multipart) -> Result<()> {
        while let Some(mut part) = msg.pop_front() {
            let flag = if msg.is_empty() { 0 } else { zmq::SNDMORE };
            self.send(part, flag)?;
        }
        Ok(())
    }

    fn recv_mp(&self) -> Result<Multipart> {
        let mut mp = Multipart::new();
        loop {
            let part = self.recv_msg(0)?;
            mp.push_back(part);
            if !self.get_rcvmore()? {
                break;
            }
        }
        Ok(mp)
    }
}
