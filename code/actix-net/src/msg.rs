use crate::prelude::*;
use crate::base::node::BaseNode;


pub(crate) type MsgType = Cow<'static, str>;

pub type NodeIdentity = Vec<u8>;
pub(crate) type IdentifiedMessage = (NodeIdentity, MessageWrapper);
pub(crate) type WrappedType = json::Value;

pub trait Remotable = Send + Serialize + DeserializeOwned + 'static;

/// Message that can be sent across Process barrier
pub trait RemoteMessage: Message + Remotable
    where Self::Result: Remotable
{
    fn type_id() -> MsgType {
        unsafe { ::std::intrinsics::type_name::<Self>().into() }
    }

    fn from_wrapped(data: &WrappedType) -> Result<Self, failure::Error> {
        Ok(json::from_value(data.clone())?)
    }

    fn to_wrapped(&self) -> Result<WrappedType, failure::Error> {
        Ok(json::to_value(self)?)
    }

    fn res_from_wrapped(data: &WrappedType) -> Result<Self::Result, failure::Error> {
        Ok(json::from_value(data.clone())?)
    }

    fn res_to_wrapped(res: &Self::Result) -> Result<WrappedType, failure::Error> {
        Ok(json::to_value(&res)?)
    }
}

pub trait Announcement: RemoteMessage<Result=()> {}

impl<T: Message + Remotable> RemoteMessage for T where Self::Result: Remotable {}

impl<T: RemoteMessage<Result=()>> Announcement for T {}

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
pub struct RegisterHandler<M: RemoteMessage>
    where M: RemoteMessage + Remotable,
          M::Result: Remotable
{
    path: String,
    pub(crate) recipient: Recipient<M>,
}

impl<M> RegisterHandler<M>
    where M: RemoteMessage + Remotable,
          M::Result: Remotable
{
    pub fn new(rec: Recipient<M>) -> Self {
        RegisterHandler {
            path: "/".into(),
            recipient: rec,
        }
    }

    pub fn with_path(path: String, rec: Recipient<M>) -> Self {
        RegisterHandler {
            path: path.to_string(),
            recipient: rec,
        }
    }
}

impl<M> Message for RegisterHandler<M>
    where M: RemoteMessage + Remotable,
          M::Result: Remotable
{
    type Result = ();
}

pub(crate) struct SendRemoteRequest<M>(pub(crate) M)
    where M: RemoteMessage + Remotable,
          M::Result: Remotable;

impl<M> Message for SendRemoteRequest<M>
    where M: RemoteMessage + Remotable,
          M::Result: Remotable
{
    type Result = Result<M::Result, RemoteError>;
}

pub(crate) struct DispatchRemoteRequest<M>
    where M: RemoteMessage + Remotable,
          M::Result: Remotable {
    pub(crate)  req: SendRemoteRequest<M>,
    pub(crate) node_id: Uuid,
}

impl<M> Message for DispatchRemoteRequest<M>
    where M: RemoteMessage + Remotable,
          M::Result: Remotable,
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
    Request(MsgType, u64, WrappedType),
    /// Response to request identified by message id, and its body
    Response(u64, Result<WrappedType, RemoteError>),
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


