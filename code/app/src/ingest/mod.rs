use crate::prelude::*;
use common::future::BoxFuture;

use std::collections::btree_map::Entry;
use common::msgs::*;


pub mod rescaler;
pub mod decision;

pub struct Ingest {
    client: anats::Client,

    db: Database,

    last: BTreeMap<PairId, Ohlc>,
}

impl Actor for Ingest {
    type Context = Context<Self>;
}

impl Handler<IngestUpdate> for Ingest {
    type Result = ();

    fn handle(&mut self, msg: IngestUpdate, ctx: &mut Context<Self>) {
        trace!("Received ingest update : {:?} with : {:?} points", msg.spec, msg.ohlc.len());
        self.apply_update(msg, ctx).unwrap();
    }
}

impl Ingest {
    pub async fn new(client : anats::Client, db: Database) -> Result<Addr<Self>, failure::Error> {
        let last = db.last_ohlc_values().compat().await?;

        Ok(Actor::create(move |ctx: &mut Context<Self>| {
            client.subscribe(crate::CHANNEL_OHLC_INGEST, None, ctx.address().recipient::<IngestUpdate>());
            Ingest {
                client,
                db,
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
        let update = OhlcUpdate::new(OhlcSpec::from_pair_1m(id.clone()), tick.clone());

        self.client.publish(crate::CHANNEL_OHLC_AGG,update);
        self.set_last(id, tick);
    }

    fn new_live(&mut self, id: &PairId, tick: Ohlc, uuid: Uuid) {
        if let Some(l) = self.get_last(id) {
            let update = OhlcUpdate::new(OhlcSpec::from_pair_1m(id.clone()), l.clone());
            self.client.publish(crate::CHANNEL_OHLC_AGG, update);
        }
        self.update_live(id, tick, uuid);
    }

    fn update_live(&mut self, id: &PairId, tick: Ohlc, uuid: Uuid) {
        let update = OhlcUpdate::new_live(OhlcSpec::from_pair_1m(id.clone()), tick.clone());
        self.client.publish(crate::CHANNEL_OHLC_AGG, update);
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


