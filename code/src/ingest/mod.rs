use ::prelude::*;
use types::*;


pub struct Ingest {
    comm: Addr<actix_net::base::comm::BaseCommunicator>,
}


impl Actor for Ingest {
    type Context = Context<Self>;
}


impl Handler<DummyUpdate> for Ingest {
    type Result = ();

    fn handle(&mut self, msg: DummyUpdate, ctx: &mut Self::Context) {
        unimplemented!()
    }
}

impl Ingest {
    pub fn new(comm: Addr<actix_net::base::comm::BaseCommunicator>) -> Addr<Self> {
        Actor::create(|_| {
            Ingest {
                comm,
            }
        })
    }
}

pub struct Worker {
    comm: Addr<actix_net::base::comm::BaseCommunicator>,
}


impl Actor for Worker {
    type Context = Context<Self>;
}


impl Handler<DummyUpdate> for Worker {
    type Result = ();

    fn handle(&mut self, msg: DummyUpdate, ctx: &mut Self::Context) {
        unimplemented!()
    }
}


impl Worker {
    pub fn new(comm: Addr<actix_net::base::comm::BaseCommunicator>) -> Addr<Self> {
        Actor::create(|_| {
            Worker {
                comm,
            }
        })
    }
}
