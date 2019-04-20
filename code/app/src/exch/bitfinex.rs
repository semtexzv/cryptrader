use crate::prelude::*;

use common::actix_web::ws;
use ::apis::bitfinex as api;


use crate::ingest;
use crate::trader::{BalanceService, TradeService, BalanceRequest, BalanceResponse, TradeRequest,
                    TradeResponse,
                    ExchangeError};

use time::PreciseTime;
use std::time::Duration;


#[derive(Debug)]
pub struct Bitfinex;

impl crate::exch::Exchange for Bitfinex {
    const NAME: &'static str = "bitfinex";
    const ENDPOINT: &'static str = "actix://bitfinex:42042";
}


use api::rest::types::SymbolDetail;
use std::collections::btree_map::BTreeMap;

pub struct BitfinexClient {
    handle: ContextHandle,
    ingest: Publisher<ingest::IngestEndpoint>,

    balance_handler: ServiceHandler<BalanceService<Bitfinex>>,
    trade_handler: ServiceHandler<TradeService<Bitfinex>>,

    ws: ws::ClientWriter,

    ohlc_ids: BTreeMap<i32, TradePair>,
    ticker_ids: BTreeMap<i32, TradePair>,
    pairs: BTreeMap<TradePair, SymbolDetail>,

    last: PreciseTime,
    nonce: i64,

}

impl Actor for BitfinexClient {
    type Context = Context<Self>;

    fn started(&mut self, ctx: &mut <Self as Actor>::Context) {
        info!("Starting bitfinex ohlc source");
    }

    fn stopping(&mut self, ctx: &mut Self::Context) -> Running {
        info!("Stopping bitfinex ohlc source");
        Running::Stop
    }


    fn stopped(&mut self, ctx: &mut <Self as Actor>::Context) {
        info!("Stopped bitfinex ohlc source");
    }
}


impl BitfinexClient {
    pub async fn new(handle: ContextHandle) -> Result<Addr<Self>, Error> {
        info!("Connecting to websocket");

        let client = compat_await!(ws::Client::new("wss://api.bitfinex.com/ws/2").connect())?;
        let (rx, mut tx) = client.into();

        let symbols = compat_await!(api::ws::get_available_symbols())?;
        let publ: Publisher<_> = compat_await!(Publisher::new(handle.clone()))?;
        let balance_handler = compat_await!(ServiceHandler::new(handle.clone()))?;

        let trade_handler = ServiceHandler::from_other(handle.clone(), &balance_handler);

        let interval = OhlcPeriod::Min1;
        let interval_secs = interval.seconds();

        info!("Bitfinex: Connected");
        let pairs: BTreeMap<TradePair, SymbolDetail> = symbols.into_iter().map(|s| {
            (TradePair::from_bfx_pair(&s.pair.to_uppercase()), s)
        }).collect();

        for (pair, symbol) in pairs.iter() {
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


        Ok(Actor::create(|ctx| {
            BitfinexClient::add_stream(rx, ctx);

            ctx.run_interval(Duration::from_secs(20), |this, ctx| {
                let now = PreciseTime::now();

                if this.last.to(now).num_seconds() > 20 {
                    panic!("Timeout")
                }
            });


            balance_handler.register(ctx.address().recipient());
            trade_handler.register(ctx.address().recipient());

            BitfinexClient {
                handle,
                ingest: publ,
                ws: tx,

                pairs,
                balance_handler,
                trade_handler,

                ohlc_ids: BTreeMap::new(),
                ticker_ids: BTreeMap::new(),
                last: PreciseTime::now(),
                nonce: unixtime_millis(),
            }
        }))
    }
}

impl Handler<ServiceRequest<BalanceService<Bitfinex>>> for BitfinexClient {
    type Result = ResponseActFuture<Self, Result<BalanceResponse, ExchangeError>, RemoteError>;

    fn handle(&mut self, msg: ServiceRequest<BalanceService<Bitfinex>>, ctx: &mut Self::Context) -> Self::Result {
        info!("Serving BalanceRequest");
        let req: BalanceRequest = msg.0;
        let fut = api::rest::wallet_info(req.trader.clone().into());
        let fut = wrap_future(fut);

        let fut = fut.then(move |res, this: &mut Self, ctx| {
            match res {
                Ok(w) => {
                    let target = w
                        .iter()
                        .find(|f| f.currency.eq_ignore_ascii_case(req.pair.tar()))
                        .map(|w| {
                            w.available
                        }).unwrap_or(0.0);

                    let source = w
                        .iter()
                        .find(|f| f.currency.eq_ignore_ascii_case(req.pair.src()))
                        .map(|w| {
                            w.available
                        }).unwrap_or(0.0);

                    let min_amount = this.pairs.get(&req.pair).map(|s| s.minimum_order_size).unwrap_or(0.0);

                    afut::ok(Ok(BalanceResponse {
                        target,
                        source,
                        min_buy: min_amount,
                        min_sell: min_amount,
                    }))
                }
                Err(e) => {
                    return afut::ok(Err(ExchangeError::InvalidInfo(e.to_string())));
                }
            }
        });

        return box fut;
    }
}

impl Handler<ServiceRequest<TradeService<Bitfinex>>> for BitfinexClient {
    type Result = ResponseActFuture<Self, Result<(), ExchangeError>, RemoteError>;

    fn handle(&mut self, msg: ServiceRequest<TradeService<Bitfinex>>, ctx: &mut Self::Context) -> Self::Result {
        info!("Serving TradeRequest");
        let req: TradeRequest = msg.0;
        let fut = api::rest::new_order(req.trader.clone().into(), req.amount, req.pair, req.buy);
        let fut = wrap_future(fut);

        let fut = fut.then(|res, this: &mut Self, ctx| {
            match res {
                Ok(w) => {
                    return afut::ok(Ok(()));
                }
                Err(e) => {
                    return afut::ok(Err(ExchangeError::InvalidInfo(e.to_string())));
                }
            }
        });

        return box fut;
    }
}


/// Handle server websocket messages
impl StreamHandler<ws::Message, ws::ProtocolError> for BitfinexClient {
    fn handle(&mut self, msg: ws::Message, ctx: &mut Context<Self>) {
        self.last = PreciseTime::now();
        //debug!("Received message");
        if let ws::Message::Text(str) = msg {
            if let Ok(r) = json::from_str::<api::ws::Resp>(&str) {
                match r.data {
                    api::ws::RespData::Sub(s) => {
                        if s.channel == "candles" {
                            let spec = api::ws::CandleSpec::from_str(&s.key.unwrap()).unwrap();

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

            if let Ok(msg) = json::from_str::<api::ws::Msg>(&str) {
                match msg {
                    api::ws::Msg(id, ref t, ref val) if t != "hb" && id != 0 => {
                        let found = false;
                        if let Some(pair) = self.ohlc_ids.get(&id) {
                            let spec = OhlcSpec::new_m("bitfinex", pair);
                            if let Ok(snap) = json::from_value::<Vec<api::ws::BfxCandle>>(val.clone()) {
                                let candles: Vec<Ohlc> = snap.iter().map(|c| c.clone().into()).collect();
                                let update = ingest::IngestUpdate {
                                    spec,
                                    ohlc: candles,
                                };


                                self.ingest.do_publish(update);
                            } else if let Ok(candle) = json::from_value::<api::ws::BfxCandle>(val.clone()) {
                                let update = ingest::IngestUpdate {
                                    spec,
                                    ohlc: vec![candle.into()],
                                };

                                self.ingest.do_publish(update);
                            };
                        }
                    }
                    api::ws::Msg(id, ref t, ref val) if t == "hb" || id == 0 => {}
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
