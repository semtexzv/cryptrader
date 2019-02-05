use crate::prelude::*;
use actix_arch::pubsub::PubSub;

pub mod rescaler;

pub const SERVICE_NAME: &str = "ingest.default.svc";

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IngestUpdate {
    pub spec: OhlcSpec,
    pub ohlc: Vec<Ohlc>,
}

impl Message for IngestUpdate { type Result = (); }

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OhlcUpdate {
    /// Specification of trade pair and exchange from which data originates
    pub spec: OhlcSpec,
    /// Actual ohlc data
    pub ohlc: Ohlc,
    /// Whether this update is not expected to change
    pub stable: bool,
}

impl Message for OhlcUpdate { type Result = (); }

impl OhlcUpdate {
    fn new(spec: OhlcSpec, ohlc: Ohlc) -> Self {
        OhlcUpdate {
            spec,
            ohlc,
            stable: false,
        }
    }
}

pub struct Ingest {
    comm: CommAddr,
    db: Addr<db::Database>,
    out: Addr<PubSub<OhlcUpdate>>,
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
        self.db.do_send(db::SaveOhlc {
            id: msg.spec.pair_id().clone(),
            ohlc: msg.ohlc.clone(),
        });

        for o in msg.ohlc.into_iter() {
            let m = OhlcUpdate {
                spec: msg.spec.clone(),
                ohlc: o,
                stable: false,
            };
            self.out.do_send(m);
        }
    }
}

impl Ingest {
    pub fn new(comm: CommAddr) -> (Addr<Self>, Addr<PubSub<OhlcUpdate>>) {
        let out = PubSub::new();
        let out2 = out.clone();

        (Actor::create(move |_| {
            Ingest {
                comm,
                db: db::start(),
                out: out.clone(),
            }
        }), out2)
    }
}


