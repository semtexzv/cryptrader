use ::prelude::*;

use msg::RemoteMessage;

pub trait RemoteActor: common::actix::Actor {}

/// Equivalent to Addr<A> for actors that live in different process, possibly on different machine
/// This will be main interface for interaction between remote actors
pub struct Remote<A: RemoteActor> {
    _p: PhantomData<A>
}

impl<A: RemoteActor> Remote<A> {
    fn send<M>(&mut self, m: M) //-> impl Future<Item=M::Result,Error=MailboxError>
        where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
              M::Result: Send + Serialize + DeserializeOwned + 'static,
              A: Handler<M>
    {
        unimplemented!()
    }

    fn do_send<M>(&mut self, m: M)
        where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
              M::Result: Send + Serialize + DeserializeOwned + 'static,
              A: Handler<M>
    {
        unimplemented!()
    }
    fn recipient<M>(&mut self) -> Recipient<M>
        where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
              M::Result: Send + Serialize + DeserializeOwned + 'static,
              A: Handler<M>
    {
        unimplemented!()
    }
}