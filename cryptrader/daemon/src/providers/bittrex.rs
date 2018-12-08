use prelude::*;
use common::*;
use ::common::reqwest::Client;

pub struct BittrexOhlcProvider {
    ctx: zmq::Context,
    sock: zmq::Socket,
}

impl ::common::AppComponent for BittrexOhlcProvider {
    fn new(ctx: ::zmq::Context) -> Result<Self> {
        let mut sock = ctx.socket(zmq::SocketType::PUB)?;
        sock.connect(::mq::ENDPOINT_AGGR_IN)?;
        return Ok(BittrexOhlcProvider {
            ctx,
            sock,
        });
    }

    fn run(self) -> Result<()> {
        loop {
            let markets = ::apis::bittrex::markets().unwrap().result.unwrap();
            let mut pairs: Vec<TradePair> = markets.iter().map(|m: &::apis::bittrex::MarketInfo| {
                TradePair::new(m.tar_currency.clone(), m.src_currency.clone())
            }).collect();
            let t1 = PreciseTime::now();
            pairs.par_iter().enumerate()
                .for_each(|(i, pair)| {
                    let mut provider = super::OhlcProvider::new().unwrap();
                    let mut client = Client::new();
                    let mut r = ::apis::bittrex::v2::undocumented_ohlc(&mut client, pair.clone()).unwrap();
                    let ohlc: Vec<Ohlc> = r.result.unwrap().iter()
                        .map(|c| c.clone().into())
                        .collect();
                    let mut spec = OhlcSpec::new_m("bittrex", pair);
                    provider.update(&spec, &ohlc.clone()).unwrap();
                    // info!("updated Bittrex: {} of {}", i, pairs.len());
                });
            let t2 = PreciseTime::now();
            info!("Bittrex loop taken : {:?}", t1.to(t2).num_milliseconds());
        }
    }
}


pub struct BittrexOhlcHistDumper;

use ::db;

impl ::common::AppComponent for BittrexOhlcHistDumper {
    fn new(ctx: ::zmq::Context) -> Result<Self> {
        Ok(BittrexOhlcHistDumper)
    }

    fn run(self) -> Result<()> {
        let provider = super::OhlcProvider::new()?;
        let mut conn = db::connect_store();
        let mut client = reqwest::Client::new();

        let mut cache: BTreeMap<PairId, u64> = ::db::max_ohlc_pair_times(&conn, "bittrex")
            .into_iter()
            .collect();

        info!("Bittrex hist dumper starting");

        loop {
            let pairs: Vec<PairId> = ::apis::bittrex::markets().unwrap().result.unwrap()
                .iter()
                .map(|m: &::apis::bittrex::MarketInfo| {
                    PairId::new("bittrex", TradePair::new(m.tar_currency.clone(), m.src_currency.clone()))
                }).collect();

            for p in pairs {
                let cached_time = cache.get(&p).map(|x| *x).unwrap_or(0);

                if cached_time < (unixtime() - 7200) as u64 {
                    let mut ohlc: Vec<Ohlc> = ::apis::bittrex::v2::undocumented_ohlc(&mut client, p.pair().clone())?
                        .result.unwrap()
                        .iter()
                        .map(|c| c.clone().into())
                        .collect();

                    ohlc = ohlc.into_iter()
                        .filter(|c| c.time > cached_time)
                        .collect();

                    if ohlc.len() > 0 {
                        info!("Bittrex Single : {:?}  = {:?}", p, ohlc.len());
                        cache.insert(p.clone(), ohlc[ohlc.len() - 1].time);
                        db::save_ohlc(&conn, &p, &ohlc);
                    }
                }
            }

            ::std::thread::sleep(::std::time::Duration::from_secs(10))
        }
    }
}

pub struct BittrexLastOhlcProvider {
    ctx: zmq::Context,
    sock: zmq::Socket,
}

impl ::common::AppComponent for BittrexLastOhlcProvider {
    fn new(ctx: ::zmq::Context) -> Result<Self> {
        let mut sock = ctx.socket(zmq::SocketType::PUB)?;
        sock.connect(::mq::ENDPOINT_AGGR_IN)?;
        return Ok(BittrexLastOhlcProvider {
            ctx,
            sock,
        });
    }

    fn run(self) -> Result<()> {
        loop {
            let markets = ::apis::bittrex::markets().unwrap().result.unwrap();
            let mut pairs: Vec<TradePair> = markets.iter().map(|m: &::apis::bittrex::MarketInfo| {
                TradePair::new(m.tar_currency.clone(), m.src_currency.clone())
            }).collect();
            let t1 = PreciseTime::now();
            info!("Bittrex last starting");
            pairs.par_iter().enumerate()
                .for_each(|(i, pair)| {
                    let mut provider = super::OhlcProvider::new().unwrap();
                    let mut client = Client::new();
                    let mut r = ::apis::bittrex::v2::last_ohlc(&mut client, pair.clone()).unwrap();
                    let ohlc: Ohlc = r.result.unwrap().remove(0).into();
                    let mut spec = OhlcSpec::new_m("bittrex", pair);
                    // provider.update(&spec, &[ohlc]).unwrap();
                    info!("updated Bittrex: {} of {:?}", i, ohlc);
                });
            let t2 = PreciseTime::now();
            info!("Bittrex last taken : {:?}", t1.to(t2).num_milliseconds());
        }
    }
}

pub struct BittrexTickerProvider;

impl AppComponent for BittrexTickerProvider {
    fn new(ctx: ::zmq::Context) -> Result<Self> {
        Ok(BittrexTickerProvider)
    }

    fn run(self) -> Result<()> {
        let provider = super::TickerProvider::new()?;
        loop {
            let sumamries = ::apis::bittrex::market_summaries()?;
            for s in sumamries.into_iter() {
                let ticker = Ticker {
                    time: ::common::unixtime() as _,
                    bid: s.bid,
                    ask: s.ask,
                    last: s.last,
                    ask_qty: None,
                    bid_qty: None,
                };
                let names: Vec<&str> = s.name.split("-").collect();
                let mut pair = PairId::new("bittrex", TradePair::new(names[1], names[0]));
                provider.update(pair, ticker)?;
            }
            thread::sleep(Duration::seconds(3).to_std()?)
        }
    }
}


use super::ExchangeWorker;

pub struct BittrexExchSvc;

impl AppComponent for BittrexExchSvc {
    fn new(ctx: ::zmq::Context) -> Result<Self> {
        Ok(BittrexExchSvc)
    }

    fn run(self) -> Result<()> {
        let mut svc = ExchangeWorker::new_filtered(ZMQ_CONTEXT.clone(), "bittrex")?;
        loop {
            let msg = svc.request()?;
            match msg {
                ExchQuery::Wallet(wq) => {
                    info!("Bittrex WalletQuery :{:?}", wq);
                    svc.reply(ExchReply::Wallet(WalletReply {
                        wallet: types::wallet::Wallet {
                            balances: BTreeMap::new(),
                        },
                        query: wq,
                    }))?;
                }
                ExchQuery::Order(eq) => {
                    error!("BTR  EX: {:?}", eq);
                    svc.reply(ExchReply::Exec(svc_types::exch::OrderReply {
                        query: eq,
                    }))?;
                }
            }
        }
    }
}