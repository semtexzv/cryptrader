use ::prelude::*;

use super::node::BaseNode;
use common::bytes::Bytes;
use std::borrow::Cow;

use super::comm::MsgType;


/// Message that can be sent across Process barrier
pub trait RemoteMessage: Message + Send + Serialize + DeserializeOwned + Send
    where Self::Result: Send + Serialize + DeserializeOwned + Send,
{
    fn type_id() -> MsgType {
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

impl<T: Message + Send + Serialize + DeserializeOwned + Send> RemoteMessage for T
    where Self::Result: Send + Serialize + DeserializeOwned + Send,
{}

pub trait Announcement: RemoteMessage<Result=()> {}

/// Request for connection to remote node, sent by application code
#[derive(Debug, Clone)]
pub(crate) struct ConnectToNode {
    pub(crate) node_addr: String
}

impl ConnectToNode {
    pub fn new(addr: String) -> Self {
        return ConnectToNode {
            node_addr: addr,
        };
    }
}

impl Message for ConnectToNode {
    type Result = Result<Addr<BaseNode>, failure::Error>;
}

/// Message denoting information about connected and identified node
#[derive(Debug, Clone)]
pub(crate) struct NodeConnected {
    pub(crate) remote_id: Uuid,
    pub(crate) addr: Addr<BaseNode>,
}


/// Message used to register recipients for remote messages
pub struct RegisterRecipientHandler<M: RemoteMessage>
    where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
          M::Result: Send + Serialize + DeserializeOwned + 'static
{
    path: String,
    pub(crate) recipient: Recipient<M>,
}

impl<M> RegisterRecipientHandler<M>
    where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
          M::Result: Send + Serialize + DeserializeOwned + 'static
{
    pub fn new(rec: Recipient<M>) -> Self {
        RegisterRecipientHandler {
            path: "/".into(),
            recipient: rec,
        }
    }

    pub fn with_path(path: String, rec: Recipient<M>) -> Self {
        RegisterRecipientHandler {
            path: path.to_string(),
            recipient: rec,
        }
    }
}

impl<M> Message for RegisterRecipientHandler<M>
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

pub(crate) struct DispatchRemoteRequest<M>
    where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
          M::Result: Send + Serialize + DeserializeOwned + 'static {
    pub(crate)  req: SendRemoteRequest<M>,
    pub(crate) node_id: Uuid,
}

impl<M> Message for DispatchRemoteRequest<M>
    where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
          M::Result: Send + Serialize + DeserializeOwned + 'static,
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
    #[fail(display = "Remote actor not found")]
    ActorNotFound,
    #[fail(display = "Remote node not found")]
    NodeNotFound,
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
    Identify(Uuid),
    /// Remote request message, consists of message type id, message instance id, and message body
    /// we need to use encoded data here, so we won't pollute whole API with generuc type
    Request(MsgType, u64, Bytes),
    /// Response to request identified by message id, and its body
    Response(u64, Result<Bytes, RemoteError>),
}

impl MessageWrapper {
    pub(crate) fn to_multipart(&self) -> Result<Multipart, failure::Error> {
        let encoded = json::to_vec(&self)?;
        let msg = ::zmq::Message::from_slice(&encoded);
        let multipart = Multipart::from(msg);
        Ok(multipart)
    }

    pub(crate) fn from_multipart(mut msg: Multipart) -> Result<Self, failure::Error> {
        let msg = msg.pop_back().unwrap();
        let decoded = json::from_slice(msg.deref())?;
        Ok(decoded)
    }
}


