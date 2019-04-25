use crate::prelude::*;
use anymap::AnyMap;

/// Service responsible for maintaining decided trading position on trading account
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PositionService;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PositionRequest {
    pub trader_id: db::Trader,
    pub pair: PairId,
    pub price_approx: f64,
    pub position: TradingPosition,
}

pub enum PositionResponse {
    Adjusted {
        amout: f64,
    },
    Unchanged,
}

impl ServiceInfo for PositionService {
    type RequestType = PositionRequest;
    type ResponseType = Result<(), ExchangeError>;
    const ENDPOINT: &'static str = "actix://ingest:42045/trader";
}


use crate::exch::{Exchange, bitfinex::Bitfinex};
use db::NewTradeData;

/// Component responsible for executing actual trades on the exchange
pub struct Trader {
    handle: ContextHandle,
    handler: ServiceHandler<PositionService>,
    db: db::Database,
    /// We store connections to individual exchanges inside an AnyMap, so we can easily add new exchanges
    conns: AnyMap,
}

impl Trader {
    pub async fn new(handle: ContextHandle, db: db::Database) -> Result<Addr<Self>> {
        let handler = await_compat!(ServiceHandler::new(handle.clone()))?;

        Ok(Actor::create(|ctx| {
            handler.register(ctx.address().recipient());
            let mut res = Self {
                handle,
                handler,
                db,
                conns: AnyMap::new(),
            };

            res.connect_handlers::<Bitfinex>(ctx);
            res
        }))
    }

    /// Connect to an exchange, denoted by the [E] type parameter
    /// This will create 2 ServiceConnections, that both utilize single Req socket
    pub fn connect_handlers<E: Exchange>(&mut self, ctx: &mut Context<Self>) {
        let balance = ServiceConnection::<BalanceService<E>>::new(self.handle.clone());
        let balance = wrap_future(balance);
        let bfx = balance.map(move |balance, this: &mut Self, ctx| {
            let trade = ServiceConnection::<TradeService<E>>::from_other(this.handle.clone(), &balance);
            let trade: ServiceConnection<TradeService<E>> = trade;
            let balance: ServiceConnection<BalanceService<E>> = balance;
            this.conns.insert(balance);
            this.conns.insert(trade);
        });

        ctx.spawn(bfx.drop_err());
    }
    /// Retrieve connection to BalanceService of  a specific exchange from internal AnyMap
    pub fn balance_handler<E: Exchange>(&mut self) -> ServiceConnection<BalanceService<E>> {
        (*self.conns.get::<ServiceConnection<BalanceService<E>>>().unwrap()).clone()
    }

    /// Retrieve connection to TradeService of a specific exchange from internal AnyMap
    pub fn trade_handler<E: Exchange>(&mut self) -> ServiceConnection<TradeService<E>> {
        (*self.conns.get::<ServiceConnection<TradeService<E>>>().unwrap()).clone()
    }

    pub async fn new_pos_async<E: Exchange>(balancer: ServiceConnection<BalanceService<E>>,
                                            trader: ServiceConnection<TradeService<E>>,
                                            db: db::Database,
                                            pos: PositionRequest,
    ) -> Result<(), ExchangeError> {
        // We use try block to catch all errors
        // And return Option of trade result from this block
        let logic: Result<Option<(_, bool)>> = try {
            let bal = await_compat!(balancer.send(BalanceRequest {
                pair: pos.pair.pair().clone(),
                trader: pos.trader_id.clone(),
            })).unwrap()?;

            let buy_avail = bal.source / pos.price_approx;
            let sell_avail = bal.target;

            let is_buy_op = if buy_avail > bal.min_buy && pos.position == TradingPosition::Long {
                Some(true)
            } else if sell_avail > bal.min_sell && pos.position == TradingPosition::Short {
                Some(false)
            } else {
                None
            };
            //println!("State:  ba: {:?}, sa: {:?}, mb : {:?} ms :{:?}", buy_avail, sell_avail, bal.min_buy, bal.min_sell);
            if let Some(buy) = is_buy_op {
                let trade = await_compat!(trader.send(TradeRequest {
                    trader: pos.trader_id.clone(),
                    pair: pos.pair.pair().clone(),
                    amount: if buy { buy_avail } else { sell_avail },
                    buy,
                })).unwrap()?;

                Some((trade, buy))
            } else { None }
        };
        // Transposition from Result<Option<>>> to Option<Result<>>
        let logic = logic.transpose();

        // We log to the db only if ther was an error or successfull trade, if there was no attempt
        // to trade, we ignore this
        if let Some(res) = logic {
            println!("Trade executed or error : {:?}", res);
            let trade = res.as_ref().map(|r| r.0.clone());
            let buy = res.as_ref().map(|r| r.1.clone());
            let buy = buy.unwrap_or(false);

            await_compat!(db.log_trade(NewTradeData {
                user_id: pos.trader_id.user_id,
                trader_id: pos.trader_id.id,
                exchange: pos.pair.exchange().into(),
                pair: pos.pair.pair().to_string(),

                buy,
                amount: 0.0,
                price: 0.0,
                status: trade.is_ok(),
                ok: trade.as_ref().map(|r| "OK".to_string()).ok(),
                error: trade.as_ref().map_err(|e| e.to_string()).err(),
            })).unwrap();
        }


        Ok(())
    }
    /// New PositionRequest was received, and it was dispatched to this exchange implementation
    pub fn new_position<E: Exchange>(&mut self, ctx: &mut Context<Self>, pos: PositionRequest) -> ResponseActFuture<Self, (), ExchangeError> {
        let balancer = self.balance_handler::<E>();
        let trader = self.trade_handler::<E>();
        let db = self.db.clone();

        return box wrap_future(actix_async_await::Compat::new(Self::new_pos_async(balancer, trader, db, pos)));

        /*

    let balance = wrap_future(balance).map_err(|_, _, _| ExchangeError::Internal);


    let res = balance.and_then(move |bal: Result<BalanceResponse, _>, this: &mut Self, ctx| {
        if let Err(e) = bal {
            return (box  wrap_future(this.db.log_trade(NewTradeData {
                user_id: pos.trader_id.user_id,
                trader_id: pos.trader_id.id,
                exchange: pos.pair.exchange().into(),
                pair: pos.pair.pair().to_string(),

                buy : false,
                amount: 0.0,
                price: 0.0,
                status: false,
                ok: None,
                error: Some(e.to_string()),
            }))
                .map_err(|e, _, _| ExchangeError::Internal)
                .map(|_, _, _| ())) as ResponseActFuture<_,_,_>;
        }


        let trade = fut.map(|f| wrap_future(f));
        if let Some(trade) = trade {
            box trade
                // Map Msg delivery error to internal error
                .map_err(|_, _, _| ExchangeError::Internal)
                // Flatten the error hierarchy
                .then(|r, _, _| {
                    afut::result(r.and_then(|r| r))
                })
                .then(move |r, this: &mut Self, ctx| {
                    wrap_future(this.db.log_trade(NewTradeData {
                        user_id: pos.trader_id.user_id,
                        trader_id: pos.trader_id.id,
                        exchange: pos.pair.exchange().into(),
                        pair: pos.pair.pair().to_string(),

                        buy,
                        amount: 0.0,
                        price: 0.0,
                        status: r.is_ok(),
                        ok: r.as_ref().map(|r| "".to_string()).ok(),
                        error: r.as_ref().map_err(|e| e.to_string()).err(),
                    }))
                        .map_err(|e, _, _| ExchangeError::Internal)
                        .map(|_, _, _| ())
                })
        } else {
            box afut::ok(())
        }
    });

    box res
    */
    }
}


impl Actor for Trader { type Context = Context<Self>; }

impl Handler<ServiceRequest<PositionService>> for Trader {
    type Result = ResponseActFuture<Self, Result<(), ExchangeError>, RemoteError>;

    fn handle(&mut self, msg: ServiceRequest<PositionService>, ctx: &mut Self::Context) -> Self::Result {
        info!("Position request : {:?}", msg);
        box match msg.0.pair.exchange() {
            "bitfinex" => {
                let r: ResponseActFuture<Self, (), ExchangeError> = box self.new_position::<Bitfinex>(ctx, msg.0);
                r
            }
            _ => {
                let r: ResponseActFuture<Self, (), ExchangeError> = box afut::ok(());
                r
            }
        }.then(|r, this, ctx| {
            info!("position future resulted in : {:?}", r);
            afut::ok(r)
        })
    }
}


#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct BalanceService<E: Exchange>(PhantomData<E>);

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BalanceRequest {
    pub pair: TradePair,
    pub trader: db::Trader,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BalanceResponse {
    pub target: f64,
    pub source: f64,
    pub min_buy: f64,
    pub min_sell: f64,
}

#[derive(Debug, Clone, Fail, Deserialize, Serialize)]
pub enum ExchangeError {
    #[fail(display = "Invalid info: {}", 0)]
    InvalidInfo(String),
    #[fail(display = "Invalid funds: {}", 0)]
    InvalidFunds(String),
    #[fail(display = "Internal err: {}", 0)]
    Internal(String),
}


impl<E: Exchange> ServiceInfo for BalanceService<E> {
    type RequestType = BalanceRequest;
    type ResponseType = Result<BalanceResponse, ExchangeError>;
    const ENDPOINT: &'static str = E::ENDPOINT;
}


#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct TradeService<E: Exchange>(PhantomData<E>);

impl<E: Exchange> ServiceInfo for TradeService<E> {
    type RequestType = TradeRequest;
    type ResponseType = Result<(), ExchangeError>;
    const ENDPOINT: &'static str = E::ENDPOINT;
}


#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TradeRequest {
    pub trader: db::Trader,
    pub pair: TradePair,
    pub amount: f64,
    pub buy: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TradeResponse {
    pub amount: f64,
    pub price: f64,
}

