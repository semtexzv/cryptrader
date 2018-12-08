use prelude::*;
use apis;
use db;

pub struct BinanceOhlcHistoryDumper;

impl AppComponent for BinanceOhlcHistoryDumper {
    fn new(ctx: ::zmq::Context) -> Result<Self> {
        Ok(BinanceOhlcHistoryDumper)
    }

    fn run(self) -> Result<()> {
        let provider = super::OhlcProvider::new()?;
        let markets = apis::binance::markets()?;
        info!("Binance got markets");

        let ids: Vec<PairId> = markets.symbols.into_iter().map(|m| {
            PairId::new("binance", TradePair::new(m.tar_name, m.src_name))
        }).collect();

        let conn = ::db::connect_store();

        info!("Binance Connected");
        let mut cache: BTreeMap<PairId, u64> = ::db::max_ohlc_pair_times(&conn, "binance")
            .into_iter()
            .collect();

        for id in ids.iter() {
            if !cache.contains_key(id) {
                cache.insert(id.clone(), 0);
            }
        }
        info!("Binance cached");


        loop {
            info!("Binance Iter");
            for (k, v) in cache.iter_mut() {
                // For now load only older data

                while *v < (unixtime() - 3600) as u64 {
                    let mut next = apis::binance::klines(k.pair(), *v * 1000)?;

                    info!("Binance Single : {:?}  = {:?}", k, next.len());
                    for n in next.iter_mut() {
                        n.time /= 1000;
                        *v = n.time;
                    }
                    db::save_ohlc(&conn, &k, &next);
                }
            }
            ::std::thread::sleep(::std::time::Duration::from_secs(10))

        }
    }
}

pub struct BinanceOhlcProvider;

impl AppComponent for BinanceOhlcProvider {
    fn new(ctx: ::zmq::Context) -> Result<Self> {
        return Ok(BinanceOhlcProvider);
    }

    fn run(self) -> Result<()> {
        loop {
            let interval = OhlcPeriod::Min1;
            let interval_secs = interval.seconds();

            ::ws::connect("wss://stream.binance.com:9443/ws/ethbtc@kline_1m", move |mut out| {
                move |msg: ::ws::Message| {
                    let mut txt = msg.as_text().unwrap();
                    Ok(())
                }
            }).unwrap();
        }
    }
}