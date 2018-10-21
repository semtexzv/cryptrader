use ::prelude::*;

use super::{
    RemoteActor, RemoteRef, RemoteAddr,
};
use base::{
    comm::{
        BaseCommunicator,
        NodeIdentity,
    },
    msg::RemoteMessage,
};
use common::HashMap;

type ActorType = &'static str;
type MsgType = Cow<'static, str>;

pub trait ActorMessageResolver {
    fn resolve(&self, comm: &mut Communicator, addr: Uuid, msg: MsgType, data: Bytes);
}

pub struct Resolver<A, M>
    where A: RemoteActor + Handler<M>,
          M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
          M::Result: Send + Serialize + DeserializeOwned + 'static
{
    _p: PhantomData<(A, M)>
}

impl<A, M> ActorMessageResolver for Resolver<A, M>
    where A: RemoteActor + Handler<M>,
          A::Context: actix::dev::ToEnvelope<A, M>,
          M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
          M::Result: Send + Serialize + DeserializeOwned + 'static
{
    fn resolve(&self, comm: &mut Communicator, addr: Uuid, msg: MsgType, data: Bytes) {
        let map: &mut HashMap<Uuid, Addr<A>> = comm.actors.entry::<HashMap<Uuid, Addr<A>>>().or_insert_with(|| HashMap::new());
        if let Some(actor) = map.get(&addr) {
            let mut msg = M::from_bytes(&data).unwrap();
            actor.send(msg).wait().unwrap();
        } else {
            panic!("No actor with that ID found")
        }
    }
}


pub struct Communicator {
    base: Addr<BaseCommunicator>,
    uuid : Uuid,
    actor_types: HashSet<ActorType>,
    actors: anymap::AnyMap,
    dispatchers: HashMap<(ActorType, MsgType), Box<ActorMessageResolver>>,
}

impl Actor for Communicator {
    type Context = Context<Self>;
}


pub struct GetRemoteRef<A: RemoteActor> {
    addr: Addr<A>,
}

impl<A: RemoteActor> Message for GetRemoteRef<A> {
    type Result = Result<RemoteAddr<A>, ()>;
}

impl<A: RemoteActor> Handler<GetRemoteRef<A>> for Communicator {
    type Result = Result<RemoteAddr<A>, ()>;

    fn handle(&mut self, msg: GetRemoteRef<A>, ctx: &mut Self::Context) -> Self::Result {
        if !self.actor_types.contains(A::type_id()) {
            struct Registrar<'a> {
                comm: &'a mut Communicator,
            }

            impl<'a, A: RemoteActor> super::MessageRegistry<A> for Registrar<'a> {
                fn register<M>(&mut self) where A: Handler<M>,
                                                A::Context: actix::dev::ToEnvelope<A, M>,
                                                M: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
                                                M::Result: Send + Serialize + DeserializeOwned + 'static {
                    self.comm.dispatchers.insert((A::type_id(), M::type_id()), Box::new(Resolver::<A, M> {
                        _p: PhantomData
                    }));
                }
            }
            A::register(&mut Registrar {
                comm: self,
            });
        }

        let map: &mut HashMap<Uuid, Addr<A>> = self.actors.entry::<HashMap<Uuid, Addr<A>>>().or_insert_with(|| HashMap::new());
        let id = Uuid::new_v4();
        map.insert(id.clone(), msg.addr);

        let add = RemoteAddr {
            r : RemoteRef{
                node_id : self.uuid.clone(),
                actor_id : id.clone(),
                _p : PhantomData,
            },
            comm : ctx.address()
        };
        Ok(add)
    }
}



/*
pub trait AddressedComm {
    fn remote_ref<A: RemoteActor>(&self, addr: Addr<A>) -> RemoteRef<A>;
    fn resolve_ref<A: RemoteActor>(&self, r: RemoteRef<A>) -> RemoteAddr<A>;
}
*/