use ::prelude::*;

use node::NodeWorker;
use common::bytes::Bytes;
use std::borrow::Cow;

/// Message that can be sent across Process barrier
pub trait RemoteMessage: Message + Send + Serialize + DeserializeOwned + Send
    where Self::Result: Send + Serialize + DeserializeOwned + Send,
{
    fn type_id() -> Cow<'static, str> {
        unsafe { ::std::intrinsics::type_name::<Self>().into() }
    }

    fn from_bytes(data: &Bytes) -> Result<Self, failure::Error> {
        Ok(json::from_slice(&data)?)
    }

    fn to_bytes(&self) -> Result<Bytes, failure::Error> {
        Ok(Bytes::from(json::to_vec(&self)?))
    }

    fn res_from_bytes(data: &Bytes) -> Result<Self::Result, failure::Error> {
        Ok(json::from_slice(&data)?)
    }

    fn res_to_bytes(res: &Self::Result) -> Result<Bytes, failure::Error> {
        Ok(Bytes::from(json::to_vec(&res)?))
    }
}

pub trait Announcement : RemoteMessage<Result=()> {

}

#[derive(Debug, Clone)]
pub(crate) struct ConnectToNode {
    pub(crate) node_addr: String
}

impl Message for ConnectToNode {
    type Result = Result<Addr<NodeWorker>, failure::Error>;
}


pub(crate) struct RegisterLocalHandler<M: RemoteMessage>
    where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
          M::Result: Send + Serialize + DeserializeOwned + 'static
{
    pub recipient: Recipient<M>,
}

impl<M> Message for RegisterLocalHandler<M>
    where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
          M::Result: Send + Serialize + DeserializeOwned + 'static
{
    type Result = ();
}


pub(crate) struct SendRemoteRequest<M>(pub(crate) M)
    where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
          M::Result: Send + Serialize + DeserializeOwned + 'static;

impl<M> Message for SendRemoteRequest<M>
    where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
          M::Result: Send + Serialize + DeserializeOwned + 'static
{
    type Result = Result<M::Result, RemoteError>;
}

/// Is similar to `MailboxError` but contains more variant suited for reporting protocol errors
/// since remote commuincation is much more dynamic
#[derive(Debug, Fail, Serialize, Deserialize)]
pub enum RemoteError {
    #[fail(display = "Remote mailbox closed")]
    MailboxClosed,
    #[fail(display = "Remote request timed out")]
    Timeout,
    #[fail(display = "Remote handler for specified message type not found")]
    HandlerNotFound,
}


impl From<MailboxError> for RemoteError {
    fn from(v: MailboxError) -> Self {
        match v {
            MailboxError::Closed => RemoteError::MailboxClosed,
            MailboxError::Timeout => RemoteError::Timeout,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub(crate) enum MessageWrapper {
    /// Simple Heartbeat message
    Heartbeat,
    Hello,
    Capabilities(HashSet<::comm::MessageIdentity>),
    /// Remote request message, consists of message type id, message instance id, and message body
    /// we need to use encoded data here, so we won't pollute whole API with generuc type
    Request(Cow<'static, str>, u64, Bytes),
    /// Response to request identified by message id, and its body
    Response(u64, Result<Bytes, RemoteError>),
}

impl MessageWrapper {
    pub(crate) fn to_multipart(&self) -> Result<Multipart, failure::Error> {
        let mut encoded = json::to_vec(&self)?;
        let mut msg = ::zmq::Message::from_slice(&encoded);
        let mut multipart = Multipart::from(msg);
        Ok(multipart)
    }

    pub(crate) fn from_multipart(mut msg: Multipart) -> Result<Self, failure::Error> {
        let mut msg = msg.pop_back().unwrap();
        let mut decoded = json::from_slice(msg.deref())?;
        Ok(decoded)
    }
}


