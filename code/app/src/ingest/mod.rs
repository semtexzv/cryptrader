use crate::prelude::*;
use actix_arch::proxy::Proxy;

pub mod rescaler;

pub struct IngestEndpoint;

impl ServiceInfo for IngestEndpoint {
    type RequestType = IngestUpdate;
    type ResponseType = ();
    const ENDPOINT: &'static str = "actix://ingest.default.svc:42042/ingest";
}

impl EndpointInfo for IngestEndpoint {
    type MsgType = IngestUpdate;
    type FanType = FanIn;
    const ENDPOINT: &'static str = "actix://ingest.default.svc:42042/ingest";
}

pub struct RescalerOut;

impl EndpointInfo for RescalerOut {
    type MsgType = OhlcUpdate;
    type FanType = FanOut;
    const ENDPOINT: &'static str = "actix://ingest.default.svc:42043/rescaler";
}

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
    handle: ContextHandle,
    input: ServiceHandler<IngestEndpoint>,

    db: Addr<db::Database>,
    out: Recipient<OhlcUpdate>,
}

impl Actor for Ingest {
    type Context = Context<Self>;

    fn started(&mut self, ctx: &mut <Self as Actor>::Context) {
        eprintln!("Registering recipient");
        self.input.register(ctx.address().recipient());
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
            self.out.do_send(m).unwrap()
        }
    }
}

impl Ingest {
    pub fn new(handle: ContextHandle, out: Recipient<OhlcUpdate>) -> BoxFuture<Addr<Self>, failure::Error> {
        let input = ServiceHandler::new(handle.clone());


        return box input.map(|input| {
            Actor::create(move |ctx| {
                input.register(ctx.address().recipient());
                Ingest {
                    handle,
                    input,
                    db: db::start(),
                    out,
                }
            })
        }).map_err(Into::into);
    }
}


