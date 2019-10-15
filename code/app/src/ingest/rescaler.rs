use crate::prelude::*;

use crate::ingest::OhlcUpdate;
use common::types::PairId;
use actix::fut::ok;


pub struct Rescaler {
    client: anats::Client,
    db: Database,
    cache: BTreeMap<PairId, BTreeMap<i64, Ohlc>>,
}

impl Actor for Rescaler {
    type Context = Context<Self>;
}

impl Rescaler {
    pub async fn new(client: anats::Client, db: Database) -> Result<Addr<Self>, failure::Error> {
        Ok(Arbiter::start(move |ctx: &mut Context<Self>| {
            client.subscribe(crate::CHANNEL_OHLC_AGG, None, ctx.address().recipient::<OhlcUpdate>());
            Rescaler {
                client,
                db,
                cache: BTreeMap::new(),
            }
        }))
    }
}

impl Handler<OhlcUpdate> for Rescaler {
    type Result = ();

    fn handle(&mut self, msg: OhlcUpdate, ctx: &mut Self::Context) -> Self::Result {
        self.client.publish(crate::CHANNEL_OHLC_RESCALED, msg.clone());
        let addr = ctx.address();


        if msg.stable {
            let inserted = if let Some(last) = self.cache.get(&msg.spec.pair_id()) {
                let time = unixtime() - 60 * 60 * 6;
            };
            let insert: Box<dyn ActorFuture<Actor=_, Item=_, Error=failure::Error>> =
                if self.cache.get(&msg.spec.pair_id()).is_none() {
                    let msg = msg.clone();
                    let time = unixtime() - 60 * 60 * 6;

                    let hist = self.db.ohlc_history(msg.spec.pair_id().clone(), time as _);


                    box wrap_future(hist.boxed_local().compat())
                        .map(move |v, this: &mut Self, ctx| {
                            this.cache.insert(msg.spec.pair_id().clone(), v);
                        }).from_err()
                } else {
                    box actix::fut::ok(())
                };

            let b = insert.and_then(move |v, this: &mut Self, ctx| {
                let cmap = this.cache.get_mut(msg.spec.pair_id()).unwrap();
                cmap.insert(msg.ohlc.time, msg.ohlc.clone());


                for p in OhlcPeriod::VALUES[1..].iter() {
                    if msg.ohlc.time % p.seconds() == (p.seconds() - 60) {
                        let min_time = (msg.ohlc.time + 60) - p.seconds();
                        let max_time = min_time + p.seconds();
                        let iter = cmap.range(min_time..max_time);

                        let new_ohlc = Ohlc::combine_with_time(min_time, iter.map(|(k, v)| v.clone()));
                        let mut update = OhlcUpdate::new(msg.spec.clone(), new_ohlc);


                        update.spec.set_period(*p);
                        update.stable = msg.stable;
                        this.client.publish(crate::CHANNEL_OHLC_RESCALED, update);
                    }
                }
                afut::ok(())
            });


            ctx.spawn(b.drop_err());
        }
    }
}