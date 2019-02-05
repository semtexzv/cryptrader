use crate::prelude::*;

use crate::ingest::OhlcUpdate;
use common::types::PairId;


pub struct Rescaler {
    comm: CommAddr,
    db: Addr<db::Database>,
    cache: BTreeMap<PairId, BTreeMap<u64, Ohlc>>,
    out: Addr<PubSub<OhlcUpdate>>,
}

impl Actor for Rescaler {
    type Context = Context<Self>;
}

impl Rescaler {
    pub fn new(comm: CommAddr, input: Addr<PubSub<OhlcUpdate>>) -> (Addr<Self>, Addr<PubSub<OhlcUpdate>>) {
        let out = PubSub::new();
        let out2 = out.clone();

        (Actor::create(move |ctx| {
            let rec = ctx.address().recipient();
            input.do_send(Subscribe::forever(rec));
            Rescaler {
                comm,
                db: db::start(),
                cache: BTreeMap::new(),
                out,
            }
        }), out2)
    }
}

impl Handler<OhlcUpdate> for Rescaler {
    type Result = ();

    fn handle(&mut self, msg: OhlcUpdate, ctx: &mut Self::Context) -> Self::Result {
        self.out.do_send(msg.clone());
        if msg.stable {
            let insert: Box<ActorFuture<Actor=_, Item=_, Error=_>> =
                if self.cache.get(&msg.spec.pair_id()).is_none() {
                    let msg = msg.clone();
                    let time = unixtime() - 60 * 60 * 6;
                    box wrap_future(self.db.send(db::OhlcHistory::new(msg.spec.pair_id().clone(), time)))
                        .map(move |v, this: &mut Self, ctx| {
                            let v = v.unwrap();
                            this.cache.insert(msg.spec.pair_id().clone(), v);
                        })
                } else {
                    box actix::fut::ok(())
                };

            let b = insert.and_then(move |v, this: &mut Self, ctx| {
                let cmap = this.cache.get_mut(msg.spec.pair_id()).unwrap();
                cmap.insert(msg.ohlc.time, msg.ohlc.clone());

                let mut items = Vec::new();

                for p in &OhlcPeriod::values()[1..] {
                    if msg.ohlc.time % p.seconds() == (p.seconds() - 60) {
                        let min_time = (msg.ohlc.time + 60) - p.seconds();
                        let max_time = min_time + p.seconds();
                        let iter = cmap.range(min_time..max_time);


                        let new_ohlc = Ohlc::combine_with_time(min_time, iter.map(|(k, v)| v));
                        let mut update = OhlcUpdate::new(msg.spec.clone(), new_ohlc);

                        update.spec.set_period(*p);
                        update.stable = msg.stable;
                        items.push(this.out.send(update));
                    }
                }
                use common::future::join_all;
                wrap_future(join_all(items).map(|_| ()))
            });


            ctx.spawn(b.drop_err());
        }
    }
}