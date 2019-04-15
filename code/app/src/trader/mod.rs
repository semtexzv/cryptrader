use crate::prelude::*;
use anymap::AnyMap;

/// Service responsible for maintaining decided trading position on trading account
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PositionService;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PositionRequest {
    pub trader_id: db::Trader,
    pub pair: PairId,
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

/// Component responsible for executing actual trades on the exchange
pub struct Trader {
    handle: ContextHandle,
    handler: ServiceHandler<PositionService>,
    db: db::Database,
    /// We store connections to individual exchanges inside an AnyMap, so we can easily add new exchanges
    conns: AnyMap,
}

impl Trader {
    pub fn new(handle: ContextHandle, db: db::Database) -> BoxFuture<Addr<Self>> {
        let handler = ServiceHandler::new(handle.clone());

        box handler.map(|handler| {
            Actor::create(|ctx| {
                handler.register(ctx.address().recipient());
                let mut res = Self {
                    handle,
                    handler,
                    db,
                    conns: AnyMap::new(),
                };

                res.connect_handlers::<Bitfinex>(ctx);
                res
            })
        }).from_err()
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

    /// New PositionRequest was received, and it was dispatched to this exchange implementation
    pub fn new_position<E: Exchange>(&mut self, ctx: &mut Context<Self>, pos: PositionRequest) -> ResponseActFuture<Self, (), ExchangeError> {
        let balancer = self.balance_handler::<E>();
        let trader = self.trade_handler::<E>();

        let balance = balancer.send(BalanceRequest {
            pair: pos.pair.pair().clone(),
            trader: pos.trader_id.clone(),
        });


        let balance = wrap_future(balance).map_err(|_, _, _| ExchangeError::Internal);


        let res = balance.and_then(move |bal: Result<BalanceResponse, _>, this: &mut Self, ctx| {
            if let Err(e) = bal {
                return (box afut::err(e)) as ResponseActFuture<_, _, _>;
            }
            let bal = bal.unwrap();

            let fut = if bal.target > bal.min_buy && pos.position == TradingPosition::Long {
                info!("Can go longer");
                Some(trader.send(TradeRequest {
                    trader: pos.trader_id.clone(),
                    pair: pos.pair.pair().clone(),
                    amount: bal.target,
                    buy: true,
                }))
            } else if bal.source > bal.min_sell && pos.position == TradingPosition::Short {
                info!("Can go shorter");
                Some(trader.send(TradeRequest {
                    trader: pos.trader_id.clone(),
                    pair: pos.pair.pair().clone(),
                    amount: bal.source,
                    buy: true,
                }))
            } else {
                info!("Not enough funds for position adjustement");
                None
            };

            let trade = fut.map(|f| wrap_future(f));
            if let Some(trade) = trade {
                box trade
                    .map_err(|_, _, _| ExchangeError::Internal)
                    .then(|r, _, _| {
                        afut::result(r.unwrap())
                    })
            } else {
                box afut::ok(())
            }
        });

        box res
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
    #[fail(display = "invalid trader auth info: {}", 0)]
    InvalidInfo(String),
    #[fail(display = "invalid trader funds : {}", 0)]
    InvalidFunds(String),
    #[fail(display = "Internal err")]
    Internal,
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
    pub price : f64,
}

