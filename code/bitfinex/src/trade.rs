use crate::{
    prelude::*,
    api::ws::BfxUpdate,
    api::rest::v1::SymbolDetail,
};
use actix_web::ws;

use common::msgs::*;
use common::types::auth::AuthInfo;


pub struct ActixWsClient {
    client: anats::Client,

    ws: Option<ws::ClientWriter>,
    spawn_handle: Option<SpawnHandle>,
    ohlc_ids: BTreeMap<usize, TradePair>,
    pairs: BTreeMap<TradePair, SymbolDetail>,

    waiting : bool,
    last: Instant,

}

impl Actor for ActixWsClient { type Context = Context<Self>; }

impl ActixWsClient {
    fn reconnect(&mut self, ctx: &mut Context<Self>) -> impl ActorFuture<Item=(), Error=(), Actor=Self> {
        warn!("Connecting subclient");
        self.disconnect(ctx);
        self.last = Instant::now();
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

    fn disconnect(&mut self, ctx: &mut Context<Self>) {
        if let Some(handle) = self.spawn_handle.take() {
            ctx.cancel_future(handle);
        }
        if let Some(ws) = self.ws.take() {}
    }

    async fn new(client: anats::Client, pairs: BTreeMap<TradePair, SymbolDetail>) -> Result<Addr<Self>> {
        Ok(Arbiter::start(|ctx: &mut Context<Self>| {
            ctx.run_interval(Duration::from_secs(20), |this, ctx: &mut Context<Self>| {
                if (Instant::now()).duration_since(this.last).as_secs() > 20 && !this.waiting {
                    error!("Did not receive update for more than 30 seconds, reconnecting");
                    let reconn = this.reconnect(ctx);
                    ctx.spawn(reconn);
                    this.last = Instant::now();
                }
            });


            let mut client = ActixWsClient {
                client,

                ws: None,
                spawn_handle: None,

                ohlc_ids: BTreeMap::new(),
                pairs,

                waiting : false,
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
        use crate::api::ws::Message as ApiMsg;

        let msg = match ApiMsg::try_from(msg) {
            Ok(o) => o,
            Err(e) => {
                error!("Invalid message : {:?}", e);
                return;
            }
        };


        match msg {
            ApiMsg::ServerInfo(info) => debug!("Server info: {:?}", info),
            ApiMsg::Subscribed(ref sub) if sub.channel == "candles" => {
                let spec = if let Ok(spec) = crate::api::ws::CandleSpec::from_str(&sub.key) {
                    spec
                } else { return; };
                let pair = TradePair::from_bfx_trade_sym(&spec.2);
                self.ohlc_ids.insert(sub.channel_id, pair.clone());
            }
            ApiMsg::Subscribed(sub) => {
                warn!("Subscribed to unknown channe {:?} - {:?}", sub.channel, sub.channel_id);
            }
            ApiMsg::ChannelHeartbeat(_, _) => {}
            ApiMsg::ChannelData(channel, data) => {
                let pair = if let Some(pair) = self.ohlc_ids.get(&channel) { pair } else {
                    error!("Invalid channel id : {:?}", channel);
                    return;
                };

                //trace!("Received update for {:?}", pair);

                let spec = OhlcSpec::new(Exchange::Bitfinex, pair, OhlcPeriod::Min1);
                match json::from_value(data) {
                    Ok(BfxUpdate::One(ohlc)) => {
                        self.client.publish(crate::CHANNEL_OHLC_INGEST, IngestUpdate::new(spec, vec![ohlc.into()]));
                    }
                    Ok(BfxUpdate::Many(ohlc)) => {
                        let fut = self.client.request(crate::CHANNEL_OHLC_IMPORT, IngestUpdate::new(spec, ohlc.into_iter().map(|c| c.into()).collect::<Vec<Ohlc>>()));
                        ctx.spawn(wrap_future(fut)
                            .map_err(|e, _, _| {
                                panic!("Ohlc timeout ?? {:?}", e);
                            })
                            .map(|_, _, _| ())
                        );
                    }
                    Err(e) => {
                        error!("Invalid data provided in candle channel {:?}", e);
                    }
                };
            }
            ApiMsg::General(ref info) if info.code == 20051 => {
                self.reconnect(ctx);
            }
            ApiMsg::General(ref info) if info.code == 20060 => {
                self.disconnect(ctx);
                self.waiting = true;
                ctx.run_later(Duration::from_secs(150), |this, ctx| {
                    this.waiting = false;
                    this.reconnect(ctx);
                });
            }
            ApiMsg::General(info) => {
                panic!("Unhandled server info : {:?}", info)
            }
            ApiMsg::Unknown(data) => {
                panic!("Received uknown message : {:?}", data);
            }
        }
    }

    fn started(&mut self, ctx: &mut Context<Self>) {
        debug!("Connected");
    }

    fn error(&mut self, err: actix_web::ws::ProtocolError, ctx: &mut Self::Context) -> Running {
        let reconn = self.reconnect(ctx);
        ctx.spawn(reconn);
        return Running::Continue;
    }

    fn finished(&mut self, ctx: &mut Context<Self>) {
        let reconn = self.reconnect(ctx);
        ctx.spawn(reconn);
    }
}


pub struct BitfinexClient {
    client: anats::Client,
    ws_clients: Vec<Addr<ActixWsClient>>,
    pairs: BTreeMap<TradePair, SymbolDetail>,

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
    pub async fn new(client: anats::Client) -> Result<Addr<Self>, actix_web::Error> {
        info!("Connecting to websocket");
        let symbols = crate::api::rest::v1::get_available_symbols().await?;


        let pairs: Vec<(TradePair, SymbolDetail)> = symbols.into_iter().map(|s| {
            (TradePair::from_bfx_pair(&s.pair.to_uppercase()), s)
        }).collect();

        let mut clients = vec![];

        for chunk in pairs.chunks(25) {
            warn!("Spawning subclient");
            let ws_client = ActixWsClient::new(client.clone(), chunk.iter().map(clone).collect()).await?;

            clients.push(ws_client);
        }


        Ok(Arbiter::start(|ctx: &mut Context<Self>| {
            client.subscribe(crate::CHANNEL_BALANCE_REQUESTS, None, ctx.address().recipient::<BalanceRequest>());
            client.subscribe(crate::CHANNEL_TRADE_REQUESTS, None, ctx.address().recipient::<TradeRequest>());
            BitfinexClient {
                client,
                ws_clients: clients,
                pairs: pairs.into_iter().collect(),

            }
        }))
    }
}

impl Handler<BalanceRequest> for BitfinexClient {
    type Result = ResponseActFuture<Self, BalanceResponse, ExchangeError>;

    fn handle(&mut self, req: BalanceRequest, ctx: &mut Self::Context) -> Self::Result {
        info!("Serving BalanceRequest");

        let pairs = self.pairs.clone();
        let fut = async move {
            let info = AuthInfo::new(&req.api_key, &req.api_secret);
            let w = crate::api::rest::v1::wallet_info(info).await;

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
        }.boxed_local().compat();


        let fut = wrap_future(fut);

        return Box::new(fut);
    }
}

impl Handler<TradeRequest> for BitfinexClient {
    type Result = ResponseActFuture<Self, TradeResponse, ExchangeError>;

    fn handle(&mut self, req: TradeRequest, ctx: &mut Self::Context) -> Self::Result {
        info!("Serving TradeRequest");

        let info = AuthInfo::new(&req.api_key, &req.api_secret);
        let fut = crate::api::rest::v1::new_order(info, req.amount, req.pair, req.buy);
        let fut = wrap_future(fut.boxed_local().compat());

        let fut = fut.map_err(|e, this, ctx| {
            let err = ExchangeError::InvalidInfo(e.to_string());
            println!("TradeRequest MapErr: {:?}", err);
            err
        }).and_then(|_, _, _| afut::result(Ok(TradeResponse {
            amount: 0.,
            price: 0.,
        })));

        return Box::new(fut);
    }
}

