use ::prelude::*;

use super::{
    RemoteActor, RemoteRef, RemoteAddr,
    msg::RegisterRemoteActor,
};
use base::{
    comm::{
        BaseCommunicator,
        NodeIdentity,
    },
    msg::RemoteMessage,
};


use super::{
    msg::{
        SendAddressedMessage, AddressedMessage,
    },
};
use base::{
    msg::{
        RemoteError, RegisterRecipientHandler,
    }
};


use common::HashMap;

pub(crate) type ActorType = &'static str;
pub(crate) type MsgType = Cow<'static, str>;


pub struct Communicator {
    base: Addr<BaseCommunicator>,
    uuid: Uuid,
    // We leave dispatching messages for base communicator
    recipients: anymap::AnyMap,
    names: HashMap<String, Uuid>,
}

impl Communicator {
    pub(crate) fn recipient_map<M>(&mut self) -> &mut HashMap<Uuid, Recipient<M>>
        where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
              M::Result: Send + Serialize + DeserializeOwned + 'static
    {
        self.recipients.entry::<HashMap<Uuid, Recipient<M>>>().or_insert_with(|| HashMap::new())
    }
}

impl Actor for Communicator {
    type Context = Context<Self>;
}

impl<A: RemoteActor> Handler<RegisterRemoteActor<A>> for Communicator {
    type Result = Result<RemoteAddr<A>, ()>;

    fn handle(&mut self, msg: RegisterRemoteActor<A>, ctx: &mut Self::Context) -> Self::Result {
        let id = Uuid::new_v4();

        struct Registrar<'a, A>
            where A: Actor,
        {
            actor_id: Uuid,
            actor_addr: Addr<A>,
            comm: &'a mut Communicator,
            addr: Addr<Communicator>,
        }

        impl<'a, A: RemoteActor> super::MessageRegistry<A> for Registrar<'a, A> {
            fn register<M>(&mut self) where A: Handler<M>,
                                            A::Context: actix::dev::ToEnvelope<A, M>,
                                            M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
                                            M::Result: Send + Serialize + DeserializeOwned + 'static {
                let rec_map: &mut HashMap<Uuid, Recipient<M>> =
                    self.comm.recipients.entry::<HashMap<Uuid, Recipient<M>>>().or_insert_with(|| HashMap::new());

                rec_map.insert(self.actor_id, self.actor_addr.clone().recipient());

                self.comm.base.do_send(RegisterRecipientHandler::new(self.addr.clone().recipient::<AddressedMessage<M>>()));
            }
        }

        A::register(&mut Registrar {
            actor_id: id,
            actor_addr: msg.addr.clone(),
            comm: self,
            addr: ctx.address(),
        });

        let add = RemoteAddr {
            r: RemoteRef {
                node_id: self.uuid.clone(),
                actor_id: id.clone(),
                _p: PhantomData,
            },
            comm: ctx.address(),
        };
        Ok(add)
    }
}

impl<M> Handler<SendAddressedMessage<M>> for Communicator
    where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
          M::Result: Send + Serialize + DeserializeOwned + 'static
{
    type Result = Response<M::Result, RemoteError>;

    fn handle(&mut self, msg: SendAddressedMessage<M>, ctx: &mut Self::Context) -> Self::Result {
        let addressed = AddressedMessage {
            msg: msg.msg,
            node_id: msg.node_id,
            actor_id: msg.actor_id,
        };

        let dispatch = ::base::msg::DispatchRemoteRequest {
            req: ::base::msg::SendRemoteRequest::<AddressedMessage<M>>(addressed),
            node_id: msg.node_id,
        };

        Response::async(self.base.send(dispatch).flatten().flatten())
    }
}


impl<M> Handler<AddressedMessage<M>> for Communicator
    where M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
          M::Result: Send + Serialize + DeserializeOwned + 'static
{
    type Result = Response<M::Result, RemoteError>;

    fn handle(&mut self, msg: AddressedMessage<M>, ctx: &mut Self::Context) -> Self::Result {
        let rec = self.recipient_map::<M>();
        if let Some(act) = rec.get(&msg.actor_id) {
            return Response::async(act.send(msg.msg).map_err(|_| unimplemented!()));
        }
        return Response::reply(Err(RemoteError::ActorNotFound));
    }
}


