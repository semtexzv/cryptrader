use crate::prelude::*;
use crate::msg::*;
use crate::base::node::BaseNode;


pub(crate) trait RemoteMessageHandler: Send {
    fn handle(&self, msg: WrappedType, sender: Sender<Result<WrappedType, RemoteError>>);
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
    fn handle(&self, msg: WrappedType, sender: Sender<Result<WrappedType, RemoteError>>) {
        let msg = M::from_wrapped(&msg).unwrap();
        let fut = self.recipient.send(msg);
        let fut = fut.then(|res| {
            let reply = res
                .map(|data| M::res_to_wrapped(&data).unwrap())
                .map_err(Into::into);
            sender.send(reply).unwrap();
            Ok::<_, ()>(())
        });

        Arbiter::spawn(fut);
    }
}

#[must_use = "You should use RemoteRequests, dropping them means message response is ignored"]
pub struct RemoteRequest<M>
    where M: RemoteMessage + Remotable,
          M::Result: Remotable
{
    inner: Request<BaseNode, SendRemoteRequest<M>>,
}

impl<M> RemoteRequest<M>
    where M: RemoteMessage + Remotable,
          M::Result: Remotable
{
    pub(crate) fn new(inner: Request<BaseNode, SendRemoteRequest<M>>) -> Self {
        RemoteRequest {
            inner
        }
    }
}

impl<M> ::futures::Future for RemoteRequest<M>
    where M: RemoteMessage + Remotable,
          M::Result: Remotable
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
    where M: RemoteMessage + Remotable,
          M::Result: Remotable,
{
    node: Addr<BaseNode>,
    _p: PhantomData<M>,
}

impl<M> RemoteRecipient<M>
    where M: RemoteMessage + Remotable,
          M::Result: Send + Serialize + DeserializeOwned
{
    pub(crate) fn new(node: Addr<BaseNode>) -> Self {
        return RemoteRecipient {
            node,
            _p: PhantomData,
        };
    }
    pub fn send(&self, msg: M) -> RemoteRequest<M> {
        RemoteRequest::new(self.node.send(SendRemoteRequest(msg)))
    }
    pub fn do_send(&self, msg: M) {
        self.node.do_send(SendRemoteRequest(msg))
    }

    pub fn try_send(&self, msg: M) -> Result<(), SendError<M>> {
        self.node.try_send(SendRemoteRequest(msg)).map_err(|e| unimplemented!())
    }
}
