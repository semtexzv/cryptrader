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


impl ToString for TradingDecision {
    fn to_string(&self) -> String {
        match self {
            TradingDecision::Long => "long",
            TradingDecision::Indeterminate => "neutral",
            TradingDecision::Short => "short",
        }.to_string()
    }
}

impl FromStr for TradingDecision {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Ok(match s {
            "long" => TradingDecision::Long,
            "neutral" => TradingDecision::Indeterminate,
            "short" => TradingDecision::Short,
            _ => return Err(())
        })
    }
}


pub use self::ohlc::*;
pub use self::spec::*;
