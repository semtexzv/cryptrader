pub use ::prelude::*;

pub mod auth;

mod ohlc;
mod spec;
pub mod ticker;


#[derive(Clone, Copy, Debug, PartialEq, Eq, Deserialize, Serialize)]
pub enum TradingPosition {
    Long,
    Indeterminate,
    Short,
}


impl ToString for TradingPosition {
    fn to_string(&self) -> String {
        match self {
            TradingPosition::Long => "long",
            TradingPosition::Indeterminate => "neutral",
            TradingPosition::Short => "short",
        }.to_string()
    }
}

impl FromStr for TradingPosition {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Ok(match s {
            "long" => TradingPosition::Long,
            "neutral" => TradingPosition::Indeterminate,
            "short" => TradingPosition::Short,
            _ => return Err(())
        })
    }
}


pub use self::ohlc::*;
pub use self::spec::*;
