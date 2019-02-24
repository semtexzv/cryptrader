use crate::prelude::*;
use actix_arch::proxy::Proxy;
use common::future::BoxFuture;

use std::collections::btree_map::Entry;
use time::PreciseTime;

pub mod rescaler;
pub mod decision;

pub struct IngestEndpoint;

impl EndpointInfo for IngestEndpoint {
    type MsgType = IngestUpdate;
    type FanType = FanIn;
    const ENDPOINT: &'static str = "actix://ingest:42042/ingest";
}

pub struct RescalerOut;

impl EndpointInfo for RescalerOut {
    type MsgType = OhlcUpdate;
    type FanType = FanOut;
    const ENDPOINT: &'static str = "actix://ingest:42043/rescaler";
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
            stable: true,
        }
    }
    fn new_live(spec: OhlcSpec, ohlc: Ohlc) -> Self {
        OhlcUpdate {
            spec,
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
        trace!("Received ingest update : {:?}", msg);
        self.apply_update(msg);
    }
}

impl Ingest {
    pub fn new(handle: ContextHandle,db : db::Database, out: Recipient<OhlcUpdate>) -> BoxFuture<Addr<Self>, failure::Error> {
        let input = Subscriber::new(handle.clone());

        return box input.map(|input| {
            Arbiter::start(move |ctx : &mut Context<Self>| {
                input.register(ctx.address().recipient());
                Ingest {
                    handle,
                    input,
                    db,
                    out,
                    last: BTreeMap::new(),
                }
            })
        }).map_err(Into::into);
    }
    fn get_last(&mut self, id: &PairId) -> Option<Ohlc> {
        let mut cached = self.last.entry(id.clone());
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

    fn new_stable(&mut self, id: &PairId, tick: Ohlc) -> Result<()> {
        self.out.do_send(OhlcUpdate::new(OhlcSpec::from_pair_1m(id.clone()), tick.clone()));
        self.set_last(id, tick);
        Ok(())
    }

    fn new_live(&mut self, id: &PairId, tick: Ohlc) -> Result<()> {
        if let Some(l) = self.get_last(id) {
            let mut update = OhlcUpdate::new(OhlcSpec::from_pair_1m(id.clone()), l.clone());
            self.out.do_send(update);
        }
        self.update_live(id, tick)?;
        Ok(())
    }

    fn update_live(&mut self, id: &PairId, tick: Ohlc) -> Result<()> {
        let mut update = OhlcUpdate::new_live(OhlcSpec::from_pair_1m(id.clone()), tick.clone());
        self.out.do_send(update);
        self.set_last(id, tick);
        Ok(())
    }

    fn apply_update(&mut self, data: IngestUpdate) -> Result<()> {
        let id = data.spec.pair_id();
        let mut last_value = self.get_last(&data.spec.pair_id());
        let mut last_time = if let Some(ref s) = last_value {
            s.time
        } else {
            0
        };

        let mut now = (::common::unixtime());
        let mut max_stable_time = now - 60;

        let mut filtered: Vec<Ohlc> = data.ohlc
            .iter()
            .filter(|t| t.time >= last_time.saturating_sub(60))
            .map(|x| x.clone())
            .collect();

        filtered.sort_by_key(|x| x.time);

        let f = self.db.do_save_ohlc(data.spec.pair_id().clone(), data.ohlc.clone());

        for tick in filtered {
            let tick = tick.clone();
            let mut exch = data.spec.exch().clone();
            let mut pair = data.spec.pair().clone();
            if tick.time > last_time && tick.time <= max_stable_time {
                trace!("{}/{} NEW STABLE  @ {:?} off: {:?}", exch, pair, tick.time, now - tick.time);
                self.new_stable(id, tick)?;
            } else if tick.time > last_time && tick.time > max_stable_time {
                trace!("{}/{} NEW LIVE    @ {:?} off: {:?}", exch, pair, tick.time, now - tick.time);
                self.new_live(id, tick)?;
            } else if tick.time == last_time && tick.time > max_stable_time {
                trace!("{}/{}  UPDATE LIVE @ {:?} off: {:?}", exch, pair, tick.time, now - tick.time);
                self.update_live(id, tick)?;
            }
        }
        Ok(())
    }
}


