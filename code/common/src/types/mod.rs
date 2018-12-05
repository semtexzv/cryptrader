pub use ::prelude::*;

pub mod auth;

pub mod ohlc;
pub mod ticker;
pub mod wallet;
pub mod spec;



#[derive(Clone, Debug, PartialEq, Eq, Deserialize, Serialize)]
pub enum TradingDecision {
    Long,
    Indeterminate,
    Short,
}
