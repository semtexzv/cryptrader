use crate::prelude::*;

use common::actix_web::ws;
use ::apis::bitfinex as api;


use crate::ingest;
use crate::trader::{BalanceService, TradeService, BalanceRequest, BalanceResponse, TradeRequest,
                    TradeResponse,
                    ExchangeError};



#[derive(Debug)]
pub struct Bitfinex;

impl crate::exch::Exchange for Bitfinex {
    const NAME: &'static str = "bitfinex";
    const ENDPOINT: &'static str = "actix://bitfinex:42042";
}

use api::rest::types::SymbolDetail;
use std::collections::btree_map::BTreeMap;
use apis::bitfinex::ws::BfxUpdate;

pub struct ActixWsClient {
    handle: ContextHandle,
    ingest: Publisher<ingest::IngestEndpoint>,

    ws: Option<ws::ClientWriter>,
    spawn_handle: Option<SpawnHandle>,
    ohlc_ids: BTreeMap<i32, TradePair>,
    pairs: BTreeMap<TradePair, SymbolDetail>,

    last: Instant,

}

impl Actor for ActixWsClient { type Context = Context<Self>; }

impl ActixWsClient {
    fn reconnect(&mut self, ctx: &mut Context<Self>) -> impl ActorFuture<Item=(), Error=(), Actor=Self> {
        info!("Connecting subclient");

        if let Some(handle) = self.spawn_handle.take() {
            ctx.cancel_future(handle);
        }
        self.ws = None;

        let client = wrap_future(ws::Client::new("wss://api-pub.bitfinex.com/ws/2").connect());
        return client.map(|client, this: &mut Self, ctx| {
            let (rx, mut tx) = client.into();

            for (pair, symbol) in this.pairs.iter() {
                let trade_sym = pair.bfx_trade_sym();
                let ohlc_sub = json!({
                        "event" : "subscribe",
                        "channel" : "candles",
                        "key" : format!("trade:{}:{}", OhlcPeriod::Min1.bfx_str() ,trade_sym),
                    });
                tx.text(json::to_string(&ohlc_sub).unwrap());
            }


            debug!("Send {} pair requests", this.pairs.len());
            this.ws = Some(tx);
            this.spawn_handle = Some(ActixWsClient::add_stream(rx, ctx));
            ()
        }).drop_err();
    }

    async fn new(handle: ContextHandle,
                 ingest: Publisher<ingest::IngestEndpoint>,
                 pairs: BTreeMap<TradePair, SymbolDetail>,
    ) -> Result<Addr<Self>> {
        Ok(Arbiter::start(|ctx: &mut Context<Self>| {
            ctx.run_interval(Duration::from_secs(20), |this, ctx: &mut Context<Self>| {
                if (Instant::now()).duration_since(this.last).as_secs() > 20 {
                    let reconn = this.reconnect(ctx);
                    ctx.spawn(reconn);
                    this.last = Instant::now();
                }
            });

            let mut client = ActixWsClient {
                handle,
                ingest,

                ws: None,
                spawn_handle: None,

                ohlc_ids: BTreeMap::new(),
                pairs,

                last: Instant::now(),
            };

            let reconn = client.reconnect(ctx);
            ctx.spawn(reconn);

            client
        }))
    }
}


/// Handle server websocket messages
impl StreamHandler<ws::Message, ws::ProtocolError> for ActixWsClient {
    fn handle(&mut self, msg: ws::Message, ctx: &mut Context<Self>) {
        self.last = Instant::now();

        let text = if let ws::Message::Text(text) = msg {
            text
        } else {
            return;
        };
        if let Ok(r) = json::from_str::<api::ws::Resp>(&text) {
            match r.data {
                api::ws::RespData::Sub(ref s) => {
                    if s.channel == "candles" {
                        let spec = api::ws::CandleSpec::from_str(s.key.as_ref().unwrap()).unwrap();
                        let pair = TradePair::from_bfx_trade_sym(&spec.2);
                        self.ohlc_ids.insert(r.chan_id, pair.clone());
                    } else {
                        info!("Unknown channel msg: {:?}", r)
                    }
                }
                _ => {}
            }
        };

        if let Ok(msg) = json::from_str::<api::ws::Msg>(&text) {
            match msg {
                api::ws::Msg(id, ref t, ref val) if t != "hb" && id != 0 => {
                    if let Some(pair) = self.ohlc_ids.get(&id) {
                        let spec = OhlcSpec::new_m("bitfinex", pair);

                        if let Ok(update) = json::from_value::<BfxUpdate>(val.clone()).map(|x| x.data()) {
                            let update = update.into_iter().map(|c| c.into()).collect();
                            let update = ingest::IngestUpdate {
                                spec,
                                ohlc: update,
                            };


                            self.ingest.do_publish(update);
                        }
                    }
                }
                api::ws::Msg(id, ref t, ref val) if t == "hb" || id == 0 => {}
                x @ _ => {
                    error!("Unhandled MSG : {:?}", x);
                }
            }
        };
    }

    fn started(&mut self, ctx: &mut Context<Self>) {
        debug!("Connected");
    }

    fn error(&mut self, err: actix_web::ws::ProtocolError, ctx: &mut Self::Context) -> Running {
        panic!("Stream error : {:?}", err);
    }

    fn finished(&mut self, ctx: &mut Context<Self>) {
        let reconn = self.reconnect(ctx);
        ctx.spawn(reconn);
    }
}


pub struct BitfinexClient {
    handle: ContextHandle,
    ingest: Publisher<ingest::IngestEndpoint>,
    balance_handler: ServiceHandler<BalanceService<Bitfinex>>,
    trade_handler: ServiceHandler<TradeService<Bitfinex>>,
    ws_clients: Vec<Addr<ActixWsClient>>,
    ohlc_ids: BTreeMap<i32, TradePair>,
    pairs: BTreeMap<TradePair, SymbolDetail>,
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
        let symbols = await_compat!(api::ws::get_available_symbols())?;


        let pairs: Vec<(TradePair, SymbolDetail)> = symbols.into_iter().map(|s| {
            (TradePair::from_bfx_pair(&s.pair.to_uppercase()), s)
        }).collect();


        let ingest: Publisher<_> = await_compat!(Publisher::new(handle.clone()))?;
        let balance_handler = await_compat!(ServiceHandler::new(handle.clone()))?;

        let trade_handler = ServiceHandler::from_other(handle.clone(), &balance_handler);


        let mut clients = vec![];

        for chunk in pairs.chunks(100) {
            let ws_client = await_compat!(ActixWsClient::new(handle.clone(), ingest.clone(), chunk.iter().map(clone).collect()))?;

            clients.push(ws_client);
        }


        Ok(Actor::create(|ctx: &mut Context<Self>| {
            balance_handler.register(ctx.address().recipient());
            trade_handler.register(ctx.address().recipient());

            BitfinexClient {
                handle,
                ingest,
                ws_clients: clients,
                pairs: pairs.into_iter().collect(),
                balance_handler,
                trade_handler,
                ohlc_ids: BTreeMap::new(),
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
        let pairs = self.pairs.clone();
        let fut = async move {
            let w = await_compat!(api::rest::wallet_info(req.trader.clone().into()));

            println!("BalanceRequest RES: {:?}", w);
            let w = w.map_err(|e| ExchangeError::InvalidInfo(e.to_string()));

            let pair = pairs.get(&req.pair);
            let min_amount = pair.map(|s| s.minimum_order_size).unwrap_or(0.0);

            w.map(|w| {
                let target = w
                    .iter()
                    .find(|f| f.currency.eq_ignore_ascii_case(req.pair.tar()) && f.typ == "exchange")
                    .map(|w| {
                        w.available * 0.98
                    }).unwrap_or(0.0);

                let source = w
                    .iter()
                    .find(|f| f.currency.eq_ignore_ascii_case(req.pair.src()) && f.typ == "exchange")
                    .map(|w| {
                        w.available * 0.98
                    }).unwrap_or(0.0);


                println!("Returning available for : {:?}, src: {:?} tar: {:?}", req.pair, source, target);
                BalanceResponse {
                    target,
                    source,
                    min_buy: min_amount,
                    min_sell: min_amount,
                }
            })
        };


        let fut = wrap_future(Compat::new(fut).then(|o| {
            println!("Wrapping: {:?}", o);
            Ok(o)
        }));

        return box fut;
    }
}

impl Handler<ServiceRequest<TradeService<Bitfinex>>> for BitfinexClient {
    type Result = ResponseActFuture<Self, Result<(), ExchangeError>, RemoteError>;

    fn handle(&mut self, msg: ServiceRequest<TradeService<Bitfinex>>, ctx: &mut Self::Context) -> Self::Result {
        info!("Serving TradeRequest");
        let req: TradeRequest = msg.0;
        let fut = api::rest::new_order(req.trader.clone().into(), req.amount, req.pair, req.buy);
        let fut = wrap_future(Compat::new(fut));

        let fut = fut.map_err(|e, this, ctx| {
            let err = ExchangeError::InvalidInfo(e.to_string());
            println!("TradeRequest MapErr: {:?}", err);
            err
        }).then(|r, _, _| afut::result(Ok(r.map(|_| ()))));

        return box fut;
    }
}
