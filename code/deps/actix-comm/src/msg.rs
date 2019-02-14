use crate::prelude::*;

pub(crate) type MsgType = Cow<'static, str>;
pub(crate) type Identity = Vec<u8>;
pub(crate) type IdentifiedMessage = (Identity, MessageWrapper);
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


#[derive(Message)]
#[rtype(result = "()")]
pub struct RegisterHandler<M>(pub Recipient<M>)
    where M: RemoteMessage + Remotable,
          M::Result: Remotable;

#[derive(Message)]
#[rtype(result = "()")]
pub struct RegisterDefaultHandler(pub(crate) Recipient<crate::util::ErasedMessage>);

#[derive(Message)]
#[rtype(result = "Result<M::Result,RemoteError>")]
pub struct SendRequest<M>(pub M)
    where M: RemoteMessage + Remotable,
          M::Result: Remotable;


/// Is similar to `MailboxError` but contains more variants, which are suited for reporting protocol errors
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
    /// we need to use encoded data here, so we won't pollute whole API with generic type
    Request(MsgType, u64, WrappedType),
    /// Response to request identified by message id, and its body
    Response(u64, Result<WrappedType, RemoteError>),
    Announcement(MsgType, WrappedType),
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

/*
pub trait MessageSourceAddr {
    fn register<M>(&self, rec: Recipient<M>)
        where M: RemoteMessage + Remotable,
              M::Result: Remotable;
}

pub trait MessageDestAddr {
    fn remote_send<M>(&self, msg: M) -> actix::dev::RecipientRequest<SendRequest<M>>
        where M: RemoteMessage + Remotable,
              M::Result: Remotable;
}

*/
