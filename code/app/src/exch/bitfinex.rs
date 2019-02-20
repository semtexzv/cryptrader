use crate::prelude::*;

use common::actix_web::ws;
use ::apis::bitfinex as api;
use crate::ingest;


pub struct BitfinexOhlcSource {
    handle : ContextHandle,
    ingest : Publisher<ingest::IngestEndpoint>,
    ws: ws::ClientWriter,

    ohlc_ids: BTreeMap<i32, TradePair>,
    ticker_ids: BTreeMap<i32, TradePair>,

}

impl Actor for BitfinexOhlcSource {
    type Context = Context<Self>;

    fn started(&mut self, ctx: &mut <Self as Actor>::Context) {
        info!("Starting bitfinex ohlc source");
    }

    fn stopped(&mut self, ctx: &mut <Self as Actor>::Context) {
        info!("Stopping bitfinex ohlc source");
    }
}


impl BitfinexOhlcSource {
    pub fn new(handle : ContextHandle) -> impl Future<Item=Addr<Self>, Error=Error> {
        let client = ws::Client::new("wss://api.bitfinex.com/ws/2").connect().from_err();
        let pairs = ::apis::bitfinex::get_available_pairs();
        let publ = Publisher::new(handle.clone()).map_err(Into::into);

        Future::join3(client, pairs, publ).map(|((rx, mut tx), pairs, publ)| {
            let interval = OhlcPeriod::Min1;
            let interval_secs = interval.seconds();

            info!("Bitfinex: Connected");

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
                tx.text(json::to_string(&ohlc_sub).unwrap());
                tx.text(json::to_string(&ticker_sub).unwrap());
            }
            debug!("Send {} pair requests", pairs.len());

            Actor::create(|ctx| {
                BitfinexOhlcSource::add_stream(rx, ctx);

                BitfinexOhlcSource {
                    handle,
                    ingest : publ,
                    ws: tx,
                    ohlc_ids: BTreeMap::new(),
                    ticker_ids: BTreeMap::new(),
                }
            })
        })
    }
}


/// Handle server websocket messages
impl StreamHandler<ws::Message, ws::ProtocolError> for BitfinexOhlcSource {
    fn handle(&mut self, msg: ws::Message, ctx: &mut Context<Self>) {
        debug!("Received message");
        if let ws::Message::Text(str) = msg {
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
                        let found = false;
                        if let Some(pair) = self.ohlc_ids.get(&id) {
                            let spec = OhlcSpec::new_m("bitfinex", pair);
                            if let Ok(snap) = json::from_value::<Vec<api::BfxCandle>>(val.clone()) {
                                let candles: Vec<Ohlc> = snap.iter().map(|c| c.clone().into()).collect();
                                let update = ingest::IngestUpdate {
                                    spec,
                                    ohlc: candles,
                                };


                                self.ingest.do_publish(update);
                            } else if let Ok(candle) = json::from_value::<api::BfxCandle>(val.clone()) {
                                let update = ingest::IngestUpdate {
                                    spec,
                                    ohlc: vec![candle.into()],
                                };

                                self.ingest.do_publish(update);
                            };
                        }
                    }
                    api::Msg(id, ref t, ref val) if t == "hb" || id == 0 => {}
                    x @ _ => {
                        error!("Unhandled MSG : {:?}", x);
                    }
                }
            };
        }
    }

    fn started(&mut self, ctx: &mut Context<Self>) {
        debug!("Connected");
    }

    fn finished(&mut self, ctx: &mut Context<Self>) {
        panic!("Server disconnected");
        ctx.stop()
    }
}