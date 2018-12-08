use prelude::*;
use apis::bitfinex as api;
use ingest;


struct CollectHandler {
    ohlc_ids: BTreeMap<i32, TradePair>,
    ticker_ids: BTreeMap<i32, TradePair>,

    ohlc_publisher: arch::ps::Publisher<ingest::IngestStageInfo>,
}

impl CollectHandler {
    fn new() -> Result<Self> {
        return Ok(CollectHandler {
            ohlc_ids: BTreeMap::new(),
            ticker_ids: BTreeMap::new(),
            ohlc_publisher: arch::ps::Publisher::new(::ZMQ_CONTEXT.clone())?,
        });
    }
}

use apis::bitfinex;

impl ws::Handler for CollectHandler {
    fn on_shutdown(&mut self) {
        panic!("Shutdown")
    }

    fn on_close(&mut self, code: ws::CloseCode, reason: &str) {
        panic!("CLOSED: {}", reason);
    }

    fn on_error(&mut self, err: ws::Error) {
        panic!("Error: {}", err);
    }

    fn on_message(&mut self, msg: ws::Message) -> StdResult<(), ws::Error> {
        let str = msg.into_text().unwrap();
        // info!("Msg: {:?}", str);
        if let Ok(r) = json::from_str::<api::Resp>(&str) {
            match r.data {
                api::RespData::Sub(s) => {
                    if s.channel == "candles" {
                        let spec = api::CandleSpec::from_str(&s.key.unwrap()).unwrap();

                        let pair = TradePair::from_bfx_trade_sym(&spec.2);

                        self.ohlc_ids.insert(r.chan_id, pair.clone());
                    } else if s.channel == "ticker" {
                        let pair = TradePair::from_bfx_pair(s.pair.as_ref().unwrap());
                        self.ticker_ids.insert(r.chan_id, pair.clone());
                    }
                }
                _ => {}
            }
        };

        if let Ok(msg) = json::from_str::<api::Msg>(&str) {
            match msg {
                api::Msg(id, ref t, ref val) if t != "hb" && id != 0 => {
                    let mut found = false;
                    if let Some(pair) = self.ohlc_ids.get(&id) {
                        let mut spec = OhlcSpec::new_m("bitfinex", pair);
                        if let Ok(snap) = json::from_value::<Vec<api::BfxCandle>>(val.clone()) {
                            let candles: Vec<Ohlc> = snap.iter().map(|c| c.clone().into()).collect();
                            let update = ingest::IngestUpdate {
                                spec,
                                ohlc: candles,
                            };

                            self.ohlc_publisher.send(&update).unwrap();
                        } else if let Ok(candle) = json::from_value::<api::BfxCandle>(val.clone()) {
                            let update = ingest::IngestUpdate {
                                spec,
                                ohlc: vec![candle.into()],
                            };
                            self.ohlc_publisher.send(&update).unwrap();
                        }
                    } else if let Some(pair) = self.ticker_ids.get(&id) {
                        /*
                        let pair_id = PairId::new("bitfinex", pair);
                        let ticker: bitfinex::TickerData = json::from_value(val.clone()).unwrap();

                        self.ticker_provider.update(pair_id, ticker.into()).unwrap();
                        */
                    } else {
                        error!("Bitfinex: Channel id {} not found", id);
                    }
                }
                api::Msg(id, ref t, ref val) if t == "hb" || id == 0 => {}
                x @ _ => {
                    error!("Unhandled MSG : {:?}", x);
                }
            }
        };
        return Ok(());
    }
}


pub struct BitfinexOhlcProvider;

impl AppComponent for BitfinexOhlcProvider {
    fn new(ctx: ::zmq::Context) -> Result<Self> {
        return Ok(BitfinexOhlcProvider);
    }

    fn run(self) -> Result<()> {
        let pairs = ::apis::bitfinex::get_available_pairs();
        let interval = OhlcPeriod::Min1;
        let interval_secs = interval.seconds();
        info!("Bitfinex ohlc starting");

        ws::connect("wss://api.bitfinex.com/ws/2", |mut out| {
            println!("Bitfinex: Connected");
            for pair in pairs.iter() {
                let trade_sym = pair.bfx_trade_sym();
                let ohlc_sub = json!({
                        "event" : "subscribe",
                        "channel" : "candles",
                        "key" : format!("trade:{}:{}", interval.bfx_str() ,trade_sym),
                    });
                let ticker_sub = json!({
                        "event" : "subscribe",
                        "channel" : "ticker",
                        "symbol" : pair.to_bfx_pair(),
                    });
                out.send(json::to_string(&ohlc_sub).unwrap()).unwrap();
                out.send(json::to_string(&ticker_sub).unwrap()).unwrap();
            }

            return CollectHandler::new().unwrap();
        })?;

        Ok(())
    }
}

/*
use super::ExchangeWorker;

pub struct BitfinexExchSvc;

impl BitfinexExchSvc {
    fn get_wallet(&self, wq: &WalletQuery) -> Result<types::wallet::Wallet> {
        unimplemented!()
    }
}

impl AppComponent for BitfinexExchSvc {
    fn new(ctx: ::zmq::Context) -> Result<Self> {
        Ok(BitfinexExchSvc)
    }


    fn run(self) -> Result<()> {
        let mut svc = ExchangeWorker::new_filtered(::common::ZMQ_CONTEXT.clone(), "bitfinex")?;
        let mut api_cl = bitfinex::v1::rest::ApiClient::new();

        loop {
            let msg = svc.request()?;
            match msg {
                ExchQuery::Wallet(wq) => {
                    let mut bfx_balances = api_cl.balances(&wq.auth)?;
                    let mut balances = BTreeMap::new();

                    for b in bfx_balances.into_iter() {
                        if b.typ == "exchange" {
                            b.currency.to_ascii_uppercase();

                            balances.insert(b.currency.to_ascii_uppercase(), Balance {
                                available: b.available,
                                min_trade: 0.001,
                                total: b.amount,
                            });
                        }
                    }
                    svc.reply(ExchReply::Wallet(WalletReply {
                        wallet: types::wallet::Wallet {
                            balances,
                        },
                        query: wq,
                    }))?;
                }
                ExchQuery::Order(oq) => {
                    error!("BFX EX: {:?}", oq);

                    let mut ex = api_cl.create_order(&oq.auth, v1::rest::types::NewOrderPayload {
                        symbol: oq.pair.pair().clone(),
                        amount: oq.amount,
                        price: oq.price,
                    })?;

                    svc.reply(ExchReply::Exec(OrderReply {
                        query: oq,
                    }))?;
                }
            }
        }
    }
}

*/