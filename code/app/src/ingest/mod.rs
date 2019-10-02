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
    type Result = Result<(), ()>;

    fn handle(&mut self, msg: IngestUpdate, ctx: &mut Context<Self>) -> Self::Result {
        info!("Received ingest update : {:?} with : {:?} points", msg.spec, msg.ohlc.len());
        warn!("Received ingest update : {:?} with : {:?} points", msg.spec, msg.ohlc.len());
        COUNTER_OHLC.with_label_values(&[&msg.spec.exchange().to_string(), &msg.spec.pair_id().to_string()]).inc_by(msg.ohlc.len() as _);
        self.apply_update(msg, ctx).unwrap();
        Ok(())
    }
}

impl Ingest {
    pub async fn new(client: anats::Client, db: Database) -> Result<Addr<Self>, failure::Error> {
        let last = db.ohlc_lasts().await?;

        Ok(Arbiter::start(move |ctx: &mut Context<Self>| {
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

        self.client.publish(crate::CHANNEL_OHLC_AGG, update);
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

            let spec = data.spec;
            let mut filtered: Vec<Ohlc> = data.ohlc
                .into_iter()
                .filter(|t| t.time >= last_time.saturating_sub(60))
                .collect();

            filtered.sort_by_key(|x| x.time);
            let ids: Vec<Uuid> = filtered.iter().map(|i| Uuid::new_v4()).collect();

            let f = this.db.do_save_ohlc(spec.pair_id().clone(), filtered.clone())
                .boxed_local()
                .compat();

            let f = wrap_future(f);

            f.then(move |_, this: &mut Self, ctx| {
                let id = spec.pair_id();
                let now = ::common::unixtime();
                let max_stable_time = now - 60;

                for (tick, uuid) in filtered.iter().zip(ids) {
                    let tick = tick.clone();
                    let exch = spec.exch().clone();
                    let pair = spec.pair().clone();
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


pub struct Import {
    client: anats::Client,

    db: Database,
}

impl Import {
    pub async fn new(client: anats::Client, db: Database) -> Addr<Self> {
        Arbiter::start(|ctx: &mut Context<Self>| {
            client.subscribe(common::CHANNEL_OHLC_IMPORT, common::GROUP_IMPORT_WORKERS.to_string(), ctx.address().recipient());
            Import {
                client,
                db,
            }
        })
    }
}

impl Actor for Import {
    type Context = Context<Self>;
}

impl Handler<IngestUpdate> for Import {
    type Result = ResponseActFuture<Self, (), ()>;

    fn handle(&mut self, msg: IngestUpdate, ctx: &mut Self::Context) -> Self::Result {
        info!("Importing {} {}", msg.ohlc.len(), msg.spec);
        let fut = self.db.do_save_ohlc(msg.spec.pair_id().clone(), msg.ohlc)
            .boxed_local()
            .compat()
            .map(|_| ())
            .map_err(|_| warn!("Could not save ohlc"));
        Box::new(wrap_future(fut))
    }
}

