use crate::prelude::*;

use crate::ingest::OhlcUpdate;
use common::types::PairId;


pub struct Rescaler {
    client: anats::Client,
    db: Database,
    cache: BTreeMap<PairId, BTreeMap<i64, Ohlc>>,
}

impl Actor for Rescaler {}

impl Rescaler {
    pub async fn new(client: anats::Client, db: Database) -> Result<Addr<Self>, failure::Error> {
        Ok(Self::start_async(move |addr| async move {
            client.subscribe(crate::CHANNEL_OHLC_AGG, None, addr.recipient::<OhlcUpdate>()).await;
            Rescaler {
                client,
                db,
                cache: BTreeMap::new(),
            }
        }))
    }
}

impl Handler<OhlcUpdate> for Rescaler {
    type Future = impl Future<Output=()> + 'static;

    #[ak::suspend]
    fn handle(mut self: ContextRef<Self>, msg: OhlcUpdate) -> Self::Future {
        async move {
            warn!("Received rescal update : {} ({})", msg.spec.pair_id(), msg.ohlc.time);
            self.client.publish(crate::CHANNEL_OHLC_RESCALED, msg.clone()).await;
        }
        /*
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
                    box wrap_future(self.db.ohlc_history(msg.spec.pair_id().clone(), time as _))
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
        */
    }
}