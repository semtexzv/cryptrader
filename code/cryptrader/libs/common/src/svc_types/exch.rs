use prelude::*;
use mq::{self, MultipartMsg, AutoSimpleMultipart, Multipart, wire_decode, wire_encode};
use types::{
    auth::AuthInfo,
    ticker::Ticker,
    spec::{TradePair, PairId, OhlcSpec},
    wallet::{Wallet, Balance},
    TradingDecision,
};

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct WalletQuery {
    pub pair: PairId,
    pub auth: AuthInfo,
}

impl AutoSimpleMultipart for WalletQuery {}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct WalletReply {
    pub query: WalletQuery,
    pub wallet: Wallet,
}

impl AutoSimpleMultipart for WalletReply {}

impl Into<ExchReply> for WalletReply {
    fn into(self) -> ExchReply {
        ExchReply::Wallet(self)
    }
}


#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct OrderQuery {
    pub pair: PairId,
    pub auth: AuthInfo,
    /// Should reflect price, at which order should be executed
    pub price: f64,
    /// positive for buy, negative for sell
    pub amount: f64,
}

impl AutoSimpleMultipart for OrderQuery {}


#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct OrderReply {
    pub query: OrderQuery,
}

impl AutoSimpleMultipart for OrderReply {}

impl Into<ExchReply> for OrderReply {
    fn into(self) -> ExchReply {
        ExchReply::Exec(self)
    }
}


#[serde(untagged)]
#[derive(Debug, Clone, Deserialize, Serialize)]
pub enum ExchQuery {
    Order(OrderQuery),
    Wallet(WalletQuery),
}

impl ::arch::proxy::RoutableMsg for ExchQuery {
    fn rq_type(&self) -> &str {
        self.exchange()
    }
}

impl ExchQuery {
    pub fn exchange(&self) -> &str {
        match self {
            &ExchQuery::Wallet(ref wq) => {
                wq.pair.exchange()
            }
            &ExchQuery::Order(ref eq) => {
                eq.pair.exchange()
            }
        }
    }
}

impl AutoSimpleMultipart for ExchQuery {}

#[serde(untagged)]
#[derive(Debug, Clone, Deserialize, Serialize)]
pub enum ExchReply {
    Wallet(WalletReply),
    Exec(OrderReply),
}


impl ::arch::proxy::RoutableMsg for ExchReply {
    fn rq_type(&self) -> &str {
        self.exchange()
    }
}

impl ExchReply {
    pub fn exchange(&self) -> &str {
        match self {
            &ExchReply::Wallet(ref wq) => {
                wq.query.pair.exchange()
            }
            &ExchReply::Exec(ref eq) => {
                eq.query.pair.exchange()
            }
        }
    }
}

impl AutoSimpleMultipart for ExchReply {}
