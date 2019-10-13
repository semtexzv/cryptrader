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
        Ok(Self::start_async(|addr| async move {
            client.subscribe(crate::CHANNEL_POSITION_REQUESTS, None, addr.recipient()).await;
            Self {
                client,
                db,
            }
        }))
    }
}


impl Actor for Trader {}

impl Handler<PositionRequest> for Trader {
    type Future = impl Future<Output=Result<PositionResponse, ExchangeError>>;

    #[ak::suspend]
    fn handle(mut self: ContextRef<Self>, msg: PositionRequest) -> Self::Future {
        info!("Position request : {:?}", msg);
        async move {
            let balance = BalanceRequest::new(msg.exch, msg.api_key, msg.api_secret, msg.pair.pair().clone());
            let balance: BalanceResponse = self.client.request(crate::CHANNEL_BALANCE_REQUESTS, balance).await.unwrap()?;
            Err(ExchangeError::InvalidFunds("".to_string()))
        }
    }
}

