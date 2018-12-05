use ::prelude::*;

pub struct Ingest {
    comm: Addr<actix_net::base::comm::BaseCommunicator>,
}


impl Actor for Ingest {
    type Context = Context<Self>;
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