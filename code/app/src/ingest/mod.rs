use crate::prelude::*;

use std::collections::btree_map::Entry;
use common::msgs::*;


pub mod rescaler;
pub mod decision;

pub struct Ingest {
    client: anats::Client,

    db: Database,

    last: BTreeMap<PairId, Ohlc>,
}

impl Actor for Ingest {}

impl Handler<IngestUpdate> for Ingest {
    type Future = impl Future<Output=()> + 'static;

    #[ak::suspend]
    fn handle(mut self: ContextRef<Self>, msg: IngestUpdate) -> Self::Future {
        warn!("Received ingest update : {} ({}) with : {:?} points", msg.spec.pair_id(), msg.ohlc[0].time, msg.ohlc.len());
        COUNTER_OHLC.with_label_values(&[&msg.spec.exchange().to_string(), &msg.spec.pair_id().to_string()]).inc_by(msg.ohlc.len() as _);
        async move {
            let last_value = self.get_last(&msg.spec.pair_id());
            let last_time = if let Some(ref s) = last_value {
                s.time
            } else {
                0
            };

            let now = ::common::unixtime();
            let max_stable_time = now - 60;

            let spec = msg.spec;
            let mut filtered: Vec<Ohlc> = msg.ohlc
                .into_iter()
                .filter(|t| t.time >= last_time.saturating_sub(60))
                .collect();

            filtered.sort_by_key(|x| x.time);
            let ids: Vec<Uuid> = filtered.iter().map(|i| Uuid::new_v4()).collect();

            let f = self.db.do_save_ohlc(spec.pair_id().clone(), filtered.clone()).await;

            let id = spec.pair_id();
            let now = ::common::unixtime();
            let max_stable_time = now - 60;

            for (tick, uuid) in filtered.iter().zip(ids) {
                let tick = tick.clone();
                let exch = spec.exch().clone();
                let pair = spec.pair().clone();
                if tick.time > last_time && tick.time <= max_stable_time {

                    let update = OhlcUpdate::new(OhlcSpec::from_pair_1m(id.clone()), tick.clone());
                    self.client.publish(crate::CHANNEL_OHLC_AGG, update).await;
                    self.set_last(id, tick);

                } else if tick.time > last_time && tick.time > max_stable_time {

                    if let Some(l) = self.get_last(id) {
                        let update = OhlcUpdate::new(OhlcSpec::from_pair_1m(id.clone()), l.clone());
                        self.client.publish(crate::CHANNEL_OHLC_AGG, update).await;
                    }

                    // TODO: self.update_live(id, tick, uuid);

                } else if tick.time == last_time && tick.time > max_stable_time {

                    let update = OhlcUpdate::new_live(OhlcSpec::from_pair_1m(id.clone()), tick.clone());
                    self.client.publish(crate::CHANNEL_OHLC_AGG, update).await;
                    self.set_last(id, tick);

                }
            }
            println!("Publish done");
        }
    }

}

impl Ingest {
    pub async fn new(client: anats::Client, db: Database) -> Result<Addr<Self>, failure::Error> {

//println!("Receiving last values");
//let last = db.ohlc_lasts().await?;
        Ok(Self::start_async(move |addr| async move {
            client.subscribe(crate::CHANNEL_OHLC_INGEST, None, addr.recipient::<IngestUpdate>()).await;
            Ingest {
                client,
                db,
                last: Default::default(),
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
}


pub struct Import {
    client: anats::Client,
    db: Database,
}


impl Import {
    pub async fn new(client: anats::Client, db: Database) -> Addr<Self> {
        Self::start_async(|addr| async move {
            client
                .subscribe(common::CHANNEL_OHLC_IMPORT, common::GROUP_IMPORT_WORKERS.to_string(), addr.recipient())
                .await;
            Import {
                client,
                db,
            }
        })
    }
}

impl Actor for Import {}

impl Handler<IngestUpdate> for Import {
    type Future = impl Future<Output=()> + 'static;

    #[ak::suspend]
    fn handle(mut self: ContextRef<Self>, msg: IngestUpdate) -> Self::Future {
        async {
//let fut = self.db.do_save_ohlc(msg.spec.pair_id().clone(), msg.ohlc);
//fut.await;
        }
    }

    /*
        fn handle(&mut self, msg: IngestUpdate, ctx: &mut Self::Context) -> Self::Result {
            info!("Importing {} {}", msg.ohlc.len(), msg.spec);
            let fut = self.db.do_save_ohlc(msg.spec.pair_id().clone(), msg.ohlc)
                .boxed_local()
                .compat()
                .map(|_| ())
                .map_err(|_| warn!("Could not save ohlc"));
            Box::new(wrap_future(fut))
        }
        */
}
