pub use ::prelude::*;

pub struct Rescaler {
    conn: ::db::ConnType,
    context: zmq::Context,
    source: zmq::Socket,
    dest: zmq::Socket,
    cache: BTreeMap<(String, TradePair), BTreeMap<u64, Ohlc>>,
}

use OhlcPeriod;

impl ::common::AppComponent for Rescaler {
    fn new(ctx: ::zmq::Context) -> Result<Self> {
        let mut source = ctx.socket(SocketType::SUB)?;
        source.connect(mq::ENDPOINT_AGGR_OUT)?;
        source.set_subscribe(b"")?;

        let mut dest = ctx.socket(SocketType::PUB)?;
        dest.bind(mq::ENDPOINT_RESCALER_OUT)?;

        let mut cache = BTreeMap::new();

        let conn = ::db::connect_store();
        return Ok(Rescaler {
            conn,
            context: ctx,
            source,
            dest,
            cache,
        });
    }

    fn run(mut self) -> Result<()> {
        loop {
            let mut msg = self.source.recv_mp()?;
            //self.dest.send(msg, 0)?;
            let mut data = OhlcUpdate::decode(&msg)?;

            if data.stable {
                // info!("Update: now:{} time: [{},{}], spec:{} stable:{}", unixtime(), data.ohlc.time, data.ohlc.time + 60, data.spec, data.stable);
                // Resend 1m data further, no changes
                self.dest.send_mp(msg)?;

                let mut conn = &self.conn;
                let mut cmap = self.cache
                    .entry((data.spec.exch().into(), data.spec.pair().clone()))
                    .or_insert_with(|| {
                        ::db::last_6hours_ohlc(conn, data.spec.exch(), &data.spec.pair())
                    });

                cmap.insert(data.ohlc.time, data.ohlc.clone());

                for p in &OhlcPeriod::values()[1..] {
                    if data.ohlc.time % p.seconds() == (p.seconds() - 60) {
                        let mut min_time = (data.ohlc.time + 60) - p.seconds();
                        let mut max_time = min_time + p.seconds();
                        let mut iter = cmap.range(min_time..max_time);


                        let mut new_ohlc = Ohlc::combine_with_time(min_time, iter.map(|(k, v)| v));
                        let mut update = OhlcUpdate::new(data.spec.pair_id(), new_ohlc);

                        update.spec.set_period(*p);
                        //info!("Rescaled OHLC Available {}/{}", data.spec.pair_id(), p.to_path_str());
                        update.stable = data.stable;
                        self.dest.send_mp(update.encode()?)?;
                    }
                }
            }
        }
    }
}