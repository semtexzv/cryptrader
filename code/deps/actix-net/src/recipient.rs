use ::prelude::*;

use msg::*;
use futures::sync::oneshot::{self, Sender};
use tokio::timer::{
    Delay, Timeout,
};
use std::time::{
    Duration, Instant,
};
use node::NodeWorker;
use node::Node;

pub(crate) trait RemoteMessageHandler: Send {
    fn handle(&self, msg: Bytes, sender: Sender<Result<Bytes, RemoteError>>);
}

pub(crate) struct LocalRecipientHandler<M>
    where M: Message + DeserializeOwned + Send,
          M::Result: DeserializeOwned + Send
{
    recipient: Recipient<M>,
}

impl<M> LocalRecipientHandler<M>
    where M: Message + DeserializeOwned + Send,
          M::Result: DeserializeOwned + Send
{
    pub(crate) fn new(rec: Recipient<M>) -> Self {
        LocalRecipientHandler {
            recipient: rec
        }
    }
}

impl<M> RemoteMessageHandler for LocalRecipientHandler<M>
    where M: RemoteMessage + Serialize + DeserializeOwned + Send + 'static,
          M::Result: Serialize + DeserializeOwned + Send {
    fn handle(&self, msg: Bytes, sender: Sender<Result<Bytes, RemoteError>>) {
        let msg = M::from_bytes(&msg).unwrap();
        let fut = self.recipient.send(msg);
        let fut = fut.then(|res| {
            let reply = res
                .map(|data| M::res_to_bytes(&data).unwrap())
                .map_err(Into::into);
            sender.send(reply).unwrap();
            Ok::<_, ()>(())
        });

        Arbiter::spawn(fut);
    }
}

#[must_use = "You should use RemoteRequests, dropping them means message response is ignored"]
pub struct RemoteRequest<M>
    where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
          M::Result: Send + Serialize + DeserializeOwned
{
    inner: Request<NodeWorker, SendRemoteRequest<M>>,
}

impl<M> RemoteRequest<M>
    where M: RemoteMessage + Send + Serialize + DeserializeOwned,
          M::Result: Send + Serialize + DeserializeOwned
{
    pub(crate) fn new(inner: Request<NodeWorker, SendRemoteRequest<M>>) -> Self {
        RemoteRequest {
            inner
        }
    }
}

impl<M> ::futures::Future for RemoteRequest<M>
    where M: RemoteMessage + Send + Serialize + DeserializeOwned,
          M::Result: Send + Serialize + DeserializeOwned
{
    type Item = M::Result;
    type Error = RemoteError;

    #[inline(always)]
    fn poll(&mut self) -> Result<Async<Self::Item>, Self::Error> {
        return match self.inner.poll() {
            Ok(Async::Ready(Ok(data))) => Ok(Async::Ready(data)),
            Ok(Async::Ready(Err(e))) => Err(e.into()),
            Ok(Async::NotReady) => Ok(Async::NotReady),
            Err(e) => Err(e.into())
        };
    }
}


pub struct RemoteRecipient<M>
    where M: RemoteMessage + Send + Serialize + DeserializeOwned,
          M::Result: Send + Serialize + DeserializeOwned
{
    node: Node,
    _p: PhantomData<M>,
}

impl<M> RemoteRecipient<M>
    where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
          M::Result: Send + Serialize + DeserializeOwned
{
    fn send(&self, msg : M) -> RemoteRequest<M> {
        self.node.send(msg)
    }
    fn do_send(&self, msg : M) {
        self.node.do_send(msg)
    }
    fn try_send(&self, msg : M)  -> Result<(),SendError<M>> {
        self.node.try_send(msg)
    }
}
