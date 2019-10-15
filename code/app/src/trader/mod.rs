use crate::prelude::*;
use common::prelude::*;
use db::NewTradeData;

use common::msgs::*;

/// Component responsible for executing actual trades on the exchange
pub struct Trader {
    client: anats::Client,
    db: db::Database,
}

impl Trader {
    pub async fn new(client: anats::Client, db: db::Database) -> Result<Addr<Self>> {
        Ok(Actor::create(|ctx| {
            client.subscribe(crate::CHANNEL_POSITION_REQUESTS, None, ctx.address().recipient());
            Self {
                client,
                db,
            }
        }))
    }
}


impl Actor for Trader { type Context = Context<Self>; }

impl Handler<PositionRequest> for Trader {
    type Result = ResponseActFuture<Self, PositionResponse, ExchangeError>;

    fn handle(&mut self, msg: PositionRequest, ctx: &mut Self::Context) -> Self::Result {
        let pair = self.db.pair_data(msg.pair_id);
        let pair = wrap_future(pair);
        
        let balance = BalanceRequest::new(msg.pair_id, msg.api_key, msg.api_secret);
        let balance = self.client.request(common::CHANNEL_BALANCE_REQUESTS, balance);

        let balance = wrap_future(balance);

        Box::new(balance.then(move |balance, this: &mut Self, ctx| {
            let balance = balance.unwrap();
            panic!("Balance : {:?}", balance);

            afut::err(ExchangeError::InvalidFunds("".to_string()))
        }))
    }
}


