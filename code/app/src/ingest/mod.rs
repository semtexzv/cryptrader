use crate::prelude::*;
use actix_arch::proxy::Proxy;
use common::future::BoxFuture;

use std::collections::btree_map::Entry;

pub mod rescaler;
pub mod decision;

pub struct IngestEndpoint;

impl EndpointInfo for IngestEndpoint {
    type MsgType = IngestUpdate;
    type FanType = FanIn;
    const ENDPOINT: &'static str = "actix://core:42042/ingest";
}

pub struct RescalerOut;

impl EndpointInfo for RescalerOut {
    type MsgType = OhlcUpdate;
    type FanType = FanOut;
    const ENDPOINT: &'static str = "actix://core:42043/rescaler";
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
    #[cfg(feature = "measure")]
    pub id: uuid::Uuid,
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
            #[cfg(feature = "measure")]
            id: Uuid::new_v4(),
            ohlc,
            stable: true,
        }
    }
    fn new_live(spec: OhlcSpec, ohlc: Ohlc) -> Self {
        OhlcUpdate {
            spec,
            #[cfg(feature = "measure")]
            id: Uuid::new_v4(),
            ohlc,
            stable: false,
        }
    }
    pub fn search_prefix(&self) -> String {
        return format!("/{}/{}/{:?}", self.spec.exchange(), self.spec.pair(), self.spec.period());
    }
}

pub struct Ingest {
    handle: ContextHandle,
    input: Subscriber<IngestEndpoint>,

    db: Database,
    out: Recipient<OhlcUpdate>,

    last: BTreeMap<PairId, Ohlc>,
}

impl Actor for Ingest {
    type Context = Context<Self>;

    fn started(&mut self, ctx: &mut <Self as Actor>::Context) {
        debug!("Registering recipient");
        self.input.register(ctx.address().recipient());
    }
}

impl Handler<IngestUpdate> for Ingest {
    type Result = ();

    fn handle(&mut self, msg: IngestUpdate, ctx: &mut Context<Self>) {
        trace!("Received ingest update : {:?} with : {:?} points", msg.spec, msg.ohlc.len());
        self.apply_update(msg, ctx).unwrap();
    }
}

impl Ingest {
    pub async fn new(handle: ContextHandle, db: Database, out: Recipient<OhlcUpdate>) -> Result<Addr<Self>, failure::Error> {
        let input = await_compat!(Subscriber::new(handle.clone()))?;
        let last = await_compat!(db.last_ohlc_values())?;

        Ok(Arbiter::start(move |ctx: &mut Context<Self>| {
            input.register(ctx.address().recipient());
            Ingest {
                handle,
                input,
                db,
                out,
                last,
            }
        }))
    }
    fn get_last(&mut self, id: &PairId) -> Option<Ohlc> {
        let cached = self.last.entry(id.clone());
        match cached {
            Entry::Occupied(oc) => {
                return Some(oc.get().clone());
            }
            Entry::Vacant(vc) => {
                return None;
            }
        }
    }

    fn set_last(&mut self, id: &PairId, data: Ohlc) {
        self.last.insert(id.clone(), data);
    }

    fn new_stable(&mut self, id: &PairId, tick: Ohlc, uuid: Uuid) {
        let mut update = OhlcUpdate::new(OhlcSpec::from_pair_1m(id.clone()), tick.clone());

        update.id = uuid;
        self.out.do_send(update).unwrap();
        self.set_last(id, tick);
    }

    fn new_live(&mut self, id: &PairId, tick: Ohlc, uuid: Uuid) {
        if let Some(l) = self.get_last(id) {
            let mut update = OhlcUpdate::new(OhlcSpec::from_pair_1m(id.clone()), l.clone());
            update.id = uuid;
            self.out.do_send(update).unwrap();
        }
        self.update_live(id, tick, uuid);
    }

    fn update_live(&mut self, id: &PairId, tick: Ohlc, uuid: Uuid) {
        let mut update = OhlcUpdate::new_live(OhlcSpec::from_pair_1m(id.clone()), tick.clone());
        update.id = uuid;

        self.out.do_send(update).unwrap();
        self.set_last(id, tick);
    }

    fn apply_update(&mut self, data: IngestUpdate, ctx: &mut Context<Self>) -> Result<()> {
        let begin = afut::ok(());

        let save = begin.then(move |_: Result<(), ()>, this: &mut Self, ctx| {
            let last_value = this.get_last(&data.spec.pair_id());
            let last_time = if let Some(ref s) = last_value {
                s.time
            } else {
                0
            };

            let now = ::common::unixtime();
            let max_stable_time = now - 60;

            let mut filtered: Vec<Ohlc> = data.ohlc
                .iter()
                .filter(|t| t.time >= last_time.saturating_sub(60))
                .map(|x| x.clone())
                .collect();

            filtered.sort_by_key(|x| x.time);
            let ids: Vec<Uuid> = filtered.iter().map(|i| Uuid::new_v4()).collect();

            let f = this.db.do_save_ohlc(data.spec.pair_id().clone(), filtered.clone());
            let f = wrap_future(f);

            let data = data.clone();
            let t1 = Instant::now();

            f.then(move |_, this: &mut Self, ctx| {
                let id = data.spec.pair_id();
                let now = ::common::unixtime();
                let max_stable_time = now - 60;

                let data = data.clone();
                for (tick, uuid) in filtered.iter().zip(ids) {
                    if cfg!(feature = "measure") {
                        log_measurement(MeasureInfo::SaveDuration {
                            update_id: uuid,
                            save_duration: Instant::now().duration_since(t1),
                        })
                    }
                    let tick = tick.clone();
                    let exch = data.spec.exch().clone();
                    let pair = data.spec.pair().clone();
                    if tick.time > last_time && tick.time <= max_stable_time {
                        this.new_stable(id, tick, uuid);
                    } else if tick.time > last_time && tick.time > max_stable_time {
                        this.new_live(id, tick, uuid);
                    } else if tick.time == last_time && tick.time > max_stable_time {
                        this.update_live(id, tick, uuid);
                    }
                }
                afut::ok::<(), (), _>(())
            })
        }).drop_err();

        ctx.spawn(save);

        Ok(())
    }
}


