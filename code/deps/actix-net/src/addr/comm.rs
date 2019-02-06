use crate::prelude::*;
use crate::msg::*;

use crate::base::comm::BaseCommunicator;
use crate::addr::msg::RegisterRemoteActor;
use crate::addr::RemoteActor;
use crate::addr::RemoteAddr;
use crate::addr::msg::AddressedMessage;
use crate::addr::RemoteRef;
use crate::addr::msg::SendAddressedMessage;
use crate::base::node::BaseNode;


pub(crate) type ActorType = &'static str;


pub struct Communicator {
    base: Addr<BaseCommunicator>,
    uuid: Uuid,
    // We leave dispatching messages for base communicator
    recipients: anymap::AnyMap,
    names: HashMap<String, Uuid>,
}

impl Communicator {
    pub fn new(addr: &str) -> Result<Addr<Self>, failure::Error> {
        return BaseCommunicator::new(addr).map(|base| {
            Communicator::create(|ctx| {
                Communicator {
                    base,
                    uuid : Uuid::new_v4(),
                    recipients : anymap::AnyMap::new(),
                    names : HashMap::new(),
                }
            })
        })
    }
    pub(crate) fn recipient_map<M>(&mut self) -> &mut HashMap<Uuid, Recipient<M>>
        where M: RemoteMessage + Remotable,
              M::Result: Remotable
    {
        self.recipients.entry::<HashMap<Uuid, Recipient<M>>>().or_insert_with(|| HashMap::new())
    }
}

impl Actor for Communicator {
    type Context = Context<Self>;
}

impl<A: RemoteActor> Handler<RegisterRemoteActor<A>> for Communicator {
    type Result = RemoteAddr<A>;

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
                                            M: RemoteMessage + Remotable,
                                            M::Result: Remotable {
                let rec_map: &mut HashMap<Uuid, Recipient<M>> =
                    self.comm.recipients.entry::<HashMap<Uuid, Recipient<M>>>().or_insert_with(|| HashMap::new());

                rec_map.insert(self.actor_id, self.actor_addr.clone().recipient());

                self.comm.base.do_send(RegisterHandler::new(self.addr.clone().recipient::<AddressedMessage<M>>()));
            }
        }

        A::register(&mut Registrar {
            actor_id: id,
            actor_addr: msg.addr.clone(),
            comm: self,
            addr: ctx.address(),
        });
        // TODO: Insert name here

        let add = RemoteAddr {
            r: RemoteRef {
                node_id: self.uuid.clone(),
                actor_id: id.clone(),
                _p: PhantomData,
            },
            comm: ctx.address(),
        };
        add
    }
}

impl<M> Handler<SendAddressedMessage<M>> for Communicator
    where M: RemoteMessage + Remotable,
          M::Result: Remotable
{
    type Result = Response<M::Result, RemoteError>;

    fn handle(&mut self, msg: SendAddressedMessage<M>, ctx: &mut Self::Context) -> Self::Result {
        let addressed = AddressedMessage {
            msg: msg.msg,
            node_id: msg.node_id,
            actor_id: msg.actor_id,
        };

        let dispatch = DispatchRemoteRequest {
            req: SendRemoteRequest::<AddressedMessage<M>>(addressed),
            node_id: msg.node_id,
        };

        Response::r#async(self.base.send(dispatch).flatten().flatten())
    }
}


impl<M> Handler<AddressedMessage<M>> for Communicator
    where M: RemoteMessage + Remotable,
          M::Result: Remotable
{
    type Result = Response<M::Result, RemoteError>;

    fn handle(&mut self, msg: AddressedMessage<M>, ctx: &mut Self::Context) -> Self::Result {
        let rec = self.recipient_map::<M>();
        if let Some(act) = rec.get(&msg.actor_id) {
            return Response::r#async(act.send(msg.msg).map_err(|_| unimplemented!()));
        }
        return Response::reply(Err(RemoteError::ActorNotFound));
    }
}


impl Handler<ConnectToNode> for Communicator {
    type Result = Response<Addr<BaseNode>, failure::Error>;

    fn handle(&mut self, msg: ConnectToNode, ctx: &mut Self::Context) -> Self::Result {
        return Response::r#async(self.base.send(msg).flatten())
    }
}


impl<M> Handler<RegisterHandler<M>> for Communicator
    where M: RemoteMessage + Remotable,
          M::Result: Remotable

{
    type Result = ();

    fn handle(&mut self, reg_msg: RegisterHandler<M>, ctx: &mut Self::Context) {
        self.base.do_send(reg_msg);
    }
}

