use crate::prelude::*;
use actix_comm::msg::Announcement;


pub struct Subscribe<A: Announcement + Clone + 'static> {
    id: Uuid,
    rec: Recipient<A>,
}

impl<A: Announcement + Clone + 'static> Subscribe<A> {
    pub fn forever(rec : Recipient<A>) -> Self {
        Self::new(Uuid::new_v4(),rec)
    }
    pub fn new(id: Uuid, rec: Recipient<A>) -> Self {
        Subscribe {
            id,
            rec,
        }
    }
}

impl<A: Announcement + Clone + 'static> Message for Subscribe<A> {
    type Result = ();
}

pub struct Unsubscribe {
    id: Uuid,
}

impl Message for Unsubscribe { type Result = (); }

pub struct Proxy<A: Announcement> {
    registry: BTreeMap<Uuid, Recipient<A>>
}

impl<A: Announcement + Clone + 'static> Actor for Proxy<A> {
    type Context = Context<Self>;
}

impl<A: Announcement + Clone + 'static> Handler<A> for Proxy<A> {
    type Result = ();

    fn handle(&mut self, msg: A, _ctx: &mut Self::Context) -> Self::Result {
        for (_id, a) in self.registry.iter_mut() {
            if let Err(_e) = a.do_send(msg.clone()) {
                // TODO: Remove from registry
            }
        }
    }
}

impl<A: Announcement + Clone + 'static> Handler<Subscribe<A>> for Proxy<A> {
    type Result = ();

    fn handle(&mut self, msg: Subscribe<A>, _ctx: &mut Self::Context) -> Self::Result {
        self.registry.insert(msg.id, msg.rec);
    }
}

impl<A: Announcement + Clone + 'static> Handler<Unsubscribe> for Proxy<A> {
    type Result = ();

    fn handle(&mut self, msg: Unsubscribe, _ctx: &mut Self::Context) -> Self::Result {
        self.registry.remove(&msg.id);
    }
}

impl<A: Announcement + Clone + 'static> Proxy<A> {
    pub fn new() -> Addr<Self> {
        Actor::create(|_| {
            Proxy {
                registry: BTreeMap::new()
            }
        })
    }
}

