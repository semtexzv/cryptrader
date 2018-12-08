pub use ::prelude::*;

pub mod auth;

mod ohlc;
mod spec;
pub mod ticker;
pub mod wallet;



#[derive(Clone, Debug, PartialEq, Eq, Deserialize, Serialize)]
pub enum TradingDecision {
    Long,
    Indeterminate,
    Short,
}


pub use self::ohlc::*;
pub use self::spec::*;
