use crate::prelude::*;
use anymap::AnyMap;

/// Service responsible for maintaining decided trading position on trading account
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PositionService;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PositionRequest {
    // TODO: Remove trader, load id locally
    trader_id: db::Trader,
    pair: PairId,
    position: TradingPosition,
}

impl ServiceInfo for PositionService {
    type RequestType = PositionRequest;
    type ResponseType = ();
    const ENDPOINT: &'static str = "actix://ingest:42045/trader";
}


use crate::exch::{Exchange, bitfinex::Bitfinex};

pub struct Trader {
    handle: ContextHandle,
    handler: ServiceHandler<PositionService>,

    conns: AnyMap,
}

impl Trader {
    pub fn new(handle: ContextHandle, db: db::Database) -> BoxFuture<Addr<Self>> {
        let handler = ServiceHandler::new(handle.clone());

        box handler.map(|(handler)| {
            Actor::create(|ctx| {
                handler.register(ctx.address().recipient());
                let mut res = Self {
                    handle,
                    handler,

                    conns: AnyMap::new(),
                };
                res.connect_handlers::<Bitfinex>(ctx);
                res
            })
        }).from_err()
    }

    pub fn connect_handlers<E: Exchange>(&mut self, ctx: &mut Context<Self>) {
        let balance = ServiceConnection::<BalanceService<E>>::new(self.handle.clone());
        let balance = wrap_future(balance);
        let bfx = balance.map(move |balance, this: &mut Self, ctx| {
            let trade = ServiceConnection::<TradeService<E>>::from_other(this.handle.clone(), &balance);
            this.conns.insert(balance);
            this.conns.insert(trade);
        });
    }
    pub fn balance_handler<E: Exchange>(&mut self) -> ServiceConnection<BalanceService<E>> {
        (*self.conns.get::<ServiceConnection<BalanceService<E>>>().unwrap()).clone()
    }
    pub fn trade_handler<E: Exchange>(&mut self) -> ServiceConnection<TradeService<E>> {
        (*self.conns.get::<ServiceConnection<TradeService<E>>>().unwrap()).clone()
    }
    pub fn new_position<E: Exchange>(&mut self, ctx: &mut Context<Self>, pos: PositionRequest) {
        let balancer = self.balance_handler::<E>();
        let trader = self.trade_handler::<E>();

        let balance = balancer.send(BalanceRequest(pos.pair.pair().clone(), pos.trader_id.clone()));
        let balance = wrap_future(balance);

        let mut res = balance.and_then(move |bal: Result<BalanceResponse, _>, this: &mut Self, ctx| {
            if let Err(e) = bal {
                panic!("Balance error : {:?}, {:?}", pos, e);
            }
            let bal = bal.unwrap();
            let fut = if bal.target > bal.min_buy && pos.position == TradingPosition::Long {
                let req = TradeRequest {
                    pair: pos.pair.pair().clone(),
                    amount: bal.target,
                    buy: true,
                };
                Some(trader.send(req))
            } else if bal.source > bal.min_sell && pos.position == TradingPosition::Short {
                let req = TradeRequest {
                    pair: pos.pair.pair().clone(),
                    amount: bal.source,
                    buy: true,
                };
                Some(trader.send(req))
            } else {
                None
            };

            let res: ResponseActFuture<Self, (), RemoteError> = if let Some(fut) = fut {
                let fut = wrap_future(fut);
                box fut.map(move |r: Result<(), ExchangeError>, this: &mut Self, ctx| {
                    if let Err(e) = r {
                        panic!("Trade error : {:?}, {:?}", pos, e);
                    }
                    ()
                })
            } else {
                box afut::ok(())
            };

            res
        });

        ctx.spawn(res.drop_err());
    }
}


impl Actor for Trader { type Context = Context<Self>; }

impl Handler<ServiceRequest<PositionService>> for Trader {
    type Result = Result<(), RemoteError>;

    fn handle(&mut self, msg: ServiceRequest<PositionService>, ctx: &mut Self::Context) -> Self::Result {
        match msg.0.pair.exchange() {
            "bitfinex" => self.new_position::<Bitfinex>(ctx, msg.0),
            _ => {}
        }
        Ok(())
    }
}


#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct BalanceService<E: Exchange>(PhantomData<E>);

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BalanceRequest(TradePair, db::Trader);

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BalanceResponse {
    target: f64,
    source: f64,
    min_buy: f64,
    min_sell: f64,
}

#[derive(Debug, Clone, Fail, Deserialize, Serialize)]
pub enum ExchangeError {
    #[fail(display = "invalid trader auth info: {}", 0)]
    InvalidInfo(String),
    #[fail(display = "invalid trader funds : {}", 0)]
    InvalidFunds(String),
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
    pair: TradePair,
    amount: f64,
    buy: bool,
}

