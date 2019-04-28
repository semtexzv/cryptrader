use ::prelude::*;
use common;
use ::common::*;
use db;
use ::common::mq::*;
use providers::RawOhlc;


pub struct OhlcAggregator {
    context: zmq::Context,
    conn: db::ConnType,
    last: BTreeMap<PairId, Ohlc>,
    pull: Socket,
    publish: Socket,
}

impl AppComponent for OhlcAggregator {
    fn new(ctx: zmq::Context) -> Result<OhlcAggregator> {
        let mut context = ctx;
        let mut conn = db::connect_store();
        let mut cache = BTreeMap::new();

        let mut pull = context.socket(SocketType::SUB)?;
        pull.bind(mq::ENDPOINT_AGGR_IN)?;
        pull.set_subscribe(b"")?;

        let mut publish = context.socket(SocketType::PUB)?;
        publish.bind(mq::ENDPOINT_AGGR_OUT)?;


        return Ok(OhlcAggregator {
            context,
            conn,
            last: cache,
            pull,
            publish,
        });
    }
    fn run(mut self) -> Result<()> {
        loop {
            let mut msg = self.pull.recv_mp()?;

            if let Ok(data) = RawOhlc::decode(&msg) {
                self.apply_update(data)?;
            } else if let Ok(data) = TickerUpdate::decode(&msg) {}
        }
    }
}

impl OhlcAggregator {
    fn get_last(&mut self, id: &PairId) -> Option<Ohlc> {
        let mut cached = self.last.entry(id.clone());
        match cached {
            Entry::Occupied(oc) => {
                return Some(oc.get().clone());
            }
            Entry::Vacant(vc) => {
                let t1 = Instant::now();
                let mut from_db = ::db::last_candle_for(&self.conn, id.exchange(), id.pair());
                let t2 = Instant::now();
                println!("Execution time : {}", t1.to(t2).num_milliseconds());

                if let Some(ref d) = from_db {
                    vc.insert(d.clone());
                }

                return from_db;
            }
        }
    }

    fn set_last(&mut self, id: &PairId, data: Ohlc) {
        self.last.insert(id.clone(), data);
    }

    fn new_stable(&mut self, id: &PairId, tick: Ohlc) -> Result<()> {
        //db::save_ohlc(&self.conn, id, &[tick.clone()]);
        let mut update = OhlcUpdate::new(id, tick.clone());
        self.publish.send_mp(update.encode()?)?;
        self.set_last(id, tick);
        //println!("NEW STRABLE");
        Ok(())
    }

    fn new_live(&mut self, id: &PairId, tick: Ohlc) -> Result<()> {
        if let Some(l) = self.get_last(id) {
            let mut update = OhlcUpdate::new(id, l.clone());
            self.publish.send_mp(update.encode()?)?;
            //db::save_ohlc(&self.conn, id, &[l.clone()]);
        }
       // db::save_ohlc(&self.conn, id, &[tick.clone()]);
        self.update_live(id, tick)?;
        Ok(())
    }

    fn update_live(&mut self, id: &PairId, tick: Ohlc) -> Result<()> {
        let mut update = OhlcUpdate::new_live(id, tick.clone());
        self.publish.send_mp(update.encode()?)?;
        self.set_last(id, tick);
        Ok(())
    }

    fn apply_update(&mut self, data: RawOhlc) -> Result<()> {
        let id = data.spec.pair_id();
        let mut last_value = self.get_last(&data.spec.pair_id());
        let mut last_time = if let Some(ref s) = last_value {
            s.time
        } else {
            0
        };

        let mut now = (::common::unixtime()) as u64;
        let mut max_stable_time = now - 60;

        let mut filtered: Vec<Ohlc> = data.ohlc
            .iter()
            .filter(|t| t.time >= last_time.saturating_sub(60))
            .map(|x| x.clone())
            .collect();

        db::save_ohlc(&self.conn, &data.spec.pair_id(), &filtered);
        for tick in filtered {
            let tick = tick.clone();
            let mut exch = data.spec.exch().clone();
            let mut pair = data.spec.pair().clone();
            if tick.time > last_time && tick.time <= max_stable_time {
                println!("{}/{} NEW STABLE  @ {:?} off: {:?}", exch, pair, tick.time, now - tick.time);
                self.new_stable(id, tick)?;
            } else if tick.time > last_time && tick.time > max_stable_time {
                println!("{}/{} NEW LIVE    @ {:?} off: {:?}", exch, pair, tick.time, now - tick.time);
                self.new_live(id, tick)?;
            } else if tick.time == last_time && tick.time > max_stable_time {
                println!("{}/{} UPDATE LIVE @ {:?} off: {:?}", exch, pair, tick.time, now - tick.time);
                self.update_live(id, tick)?;
            }
        }
        Ok(())
    }
}

pub struct TickerAggregator {
    ctx: zmq::Context,
    sub: zmq::Socket,
    rep: zmq::Socket,
    cache: BTreeMap<PairId, Ticker>,
}

impl AppComponent for TickerAggregator {
    fn new(ctx: zmq::Context) -> Result<Self> {
        let mut sub = ctx.socket(zmq::SocketType::SUB)?;
        sub.bind(mq::ENDPOINT_TICKER_AGGR_IN)?;
        sub.set_subscribe(b"")?;

        let mut rep = ctx.socket(zmq::SocketType::REP)?;
        rep.bind(mq::ENDPOINT_TICKER_SERVICE)?;

        return Ok(TickerAggregator {
            ctx,
            sub,
            rep,
            cache: BTreeMap::new(),

        });
    }
    fn run(mut self) -> Result<()> {
        loop {
            let (sub, svc) = {
                let mut poll_items = [self.sub.as_poll_item(zmq::POLLIN), self.rep.as_poll_item(zmq::POLLIN)];
                let count = zmq::poll(&mut poll_items, -1)?;
                (poll_items[0].is_readable(), poll_items[1].is_readable())
            };

            if (sub) {
                let mut msg = self.sub.recv_mp()?;
                let mut data = TickerUpdate::decode(&msg)?;
                self.cache.insert(data.pair, data.ticker);
            }

            if (svc) {
                let mut msg = self.rep.recv_mp()?;
                let mut query = TickerQuery::decode(&msg)?;
                info!("TickerAggr: requested {}", query.pair);
                let ticker = self.cache.get(&query.pair);
                let resp = TickerResponse {
                    ticker: ticker.map(clone),
                    query,
                };
                self.rep.send_mp(resp.encode()?)?;
            }
        }
    }
}
