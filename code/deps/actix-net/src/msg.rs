use ::prelude::*;

/// Message that can be sent across Process barrier
pub trait RemoteMessage: Message + Send + Serialize + DeserializeOwned
    where Self::Result: Send + Serialize + DeserializeOwned
{
    /// Unique identifier of this message type
    fn type_id() -> &'static str;
}

pub struct SendMessage<R>
    where R: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
          R::Result: Send + Serialize + DeserializeOwned + 'static,
{
    // TODO: Somehow represent target actor, so one node cant interact with multiple target nodes
    msg: R,
}

impl<R> Message for SendMessage<R>
    where R: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
          R::Result: Send + Serialize + DeserializeOwned + 'static,
{
    type Result = R::Result;
}


impl<R> SendMessage<R>
    where R: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
          R::Result: Send + Serialize + DeserializeOwned + 'static {
    pub fn new(r:R) -> Self {
        SendMessage {
            msg : r,
        }
    }
}

/// Unit struct representing remote recipient of a message
pub struct Remote;



