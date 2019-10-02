use crate::prelude::*;
use crate::types::*;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PositionRequest {
    pub exch: String,
    pub api_key: String,
    pub api_secret: String,
    pub pair: PairId,
    pub price_approx: f64,
    pub position: TradingPosition,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PositionResponse {
    Adjusted {
        amout: f64,
    },
    Unchanged,
}

impl Message for PositionRequest {
    type Result = Result<PositionResponse, ExchangeError>;
}

impl PositionRequest {
    pub fn new(exch: impl Into<String>, api_key: impl Into<String>, api_secret: impl Into<String>, pair: PairId, price: f64, position: TradingPosition) -> Self {
        Self {
            exch: exch.into(),
            api_key: api_key.into(),
            api_secret: api_secret.into(),
            pair,
            price_approx: price,
            position,
        }
    }
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

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BalanceRequest {
    pub exch: String,
    pub api_key: String,
    pub api_secret: String,

    pub pair: TradePair,
}

impl Message for BalanceRequest {
    type Result = Result<BalanceResponse, ExchangeError>;
}

impl BalanceRequest {
    pub fn new(exch: impl Into<String>, api_key: impl Into<String>, api_secret: impl Into<String>, pair: TradePair) -> Self {
        BalanceRequest {
            exch: exch.into(),
            api_key: api_key.into(),
            api_secret: api_secret.into(),
            pair,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BalanceResponse {
    pub target: f64,
    pub source: f64,
    pub min_buy: f64,
    pub min_sell: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TradeRequest {
    pub exch: String,
    pub api_key: String,
    pub api_secret: String,
    pub pair: TradePair,
    pub amount: f64,
    pub buy: bool,
}

impl Message for TradeRequest {
    type Result = Result<TradeResponse, ExchangeError>;
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TradeResponse {
    pub amount: f64,
    pub price: f64,
}

impl TradeRequest {
    pub fn new(exch: impl Into<String>, api_key: impl Into<String>, api_secret: impl Into<String>, pair: TradePair, amount: f64, buy: bool) -> Self {
        Self {
            exch: exch.into(),
            api_key: api_key.into(),
            api_secret: api_secret.into(),
            pair,
            amount,
            buy,
        }
    }
}


#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IngestUpdate {
    pub spec: OhlcSpec,
    pub ohlc: Vec<Ohlc>,
}

impl IngestUpdate {
    pub fn new(spec: impl Into<OhlcSpec>, ohlc: impl Into<Vec<Ohlc>>) -> Self {
        Self {
            spec: spec.into(),
            ohlc: ohlc.into(),
        }
    }
}

impl Message for IngestUpdate {
    type Result = Result<(), ()>;
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OhlcUpdate {
    /// Specification of trade pair and exchange from which data originates
    pub spec: OhlcSpec,
    /// Actual ohlc data
    pub ohlc: Ohlc,
    /// Whether this update is not expected to change
    pub stable: bool,
}

impl Message for OhlcUpdate { type Result = (); }

impl OhlcUpdate {
    pub fn new(spec: OhlcSpec, ohlc: Ohlc) -> Self {
        OhlcUpdate {
            spec,
            ohlc,
            stable: true,
        }
    }
    pub fn new_live(spec: OhlcSpec, ohlc: Ohlc) -> Self {
        OhlcUpdate {
            spec,
            ohlc,
            stable: false,
        }
    }
    pub fn search_prefix(&self) -> String {
        return format!("/{}/{}/{:?}", self.spec.exchange(), self.spec.pair(), self.spec.period());
    }
}



