use crate::prelude::*;

use crate::actix_arch::balancing::*;
use actix_arch::balancing::WorkerRequest;


#[derive(Debug, Serialize, Deserialize)]
pub struct EvalRequest {
    db: db::EvalRequest,
    last: u64,
}

impl Message for EvalRequest { type Result = (); }

#[derive(Debug)]
pub struct EvalService;

impl ServiceInfo for EvalService {
    type RequestType = EvalRequest;
    type ResponseType = ();
    const ENDPOINT: &'static str = "actix://ingest:42044/eval";
}


pub struct EvalWorker {
    db: Database,
}

impl Actor for EvalWorker { type Context = Context<Self>; }

impl EvalWorker {
    pub fn new(handle: ContextHandle, db: Database) -> BoxFuture<Addr<Self>> {
        box future::ok(Actor::create(|ctx|
            Self {
                db
            }))
    }
}

impl Handler<ServiceRequest<EvalService>> for EvalWorker {
    type Result = Response<(), RemoteError>;

    fn handle(&mut self, msg: ServiceRequest<EvalService>, ctx: &mut Self::Context) -> Self::Result {
        //let strat = wrap_future(self.db.send(db::GetStratData { id: msg.0.db.strategy_id }));
        //let data = wrap_future(self.db.send(db::OhlcHistory));



        return Response::reply(Ok(()));
    }
}
