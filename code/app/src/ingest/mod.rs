use crate::prelude::*;

pub const SERVICE_NAME : &str = "ingest.default.svc";

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IngestUpdate {
    pub spec: OhlcSpec,
    pub ohlc: Vec<Ohlc>,
}

impl Message for IngestUpdate { type Result = (); }

pub struct Ingest {
    comm: CommAddr,
    db : Addr<db::Database>,
}

impl Actor for Ingest {
    type Context = Context<Self>;

    fn started(&mut self, ctx: &mut <Self as Actor>::Context) {
        eprintln!("Registering recipient");
        self.comm.do_register_recipient(ctx.address().recipient::<IngestUpdate>());
    }
}

impl Handler<IngestUpdate> for Ingest {
    type Result = ();

    fn handle(&mut self, msg: IngestUpdate, ctx: &mut Context<Self>) {
        eprintln!("Received ingest update : {:?}", msg);
        self.db.do_send(db::SaveOhlc{
            id : msg.spec.pair_id().clone(),
            ohlc : msg.ohlc
        })
    }
}

impl Ingest {
    pub fn new(comm: CommAddr) -> Addr<Self> {
        Actor::create(|_| {
            Ingest {
                comm,
                db : db::start(),
            }
        })
    }
}