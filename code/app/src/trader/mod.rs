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
        let client = self.client.clone();
        info!("Position request : {:?}", msg);
        Box::new(async move {
            let balance = BalanceRequest::new(msg.exch, msg.api_key, msg.api_secret, msg.pair.pair().clone());
            let balance: BalanceResponse = client.request(crate::CHANNEL_BALANCE_REQUESTS, balance).compat().await.unwrap()?;
            Err(ExchangeError::InvalidFunds("".to_string()))
        }.boxed_local().compat().into_actor(self))
    }
}


