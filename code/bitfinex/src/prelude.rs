pub use common::*;
pub use common::prelude::*;

pub use uuid::Uuid;

pub use std::convert::TryFrom;
pub use common::types::{
    Ohlc, OhlcSpec, OhlcPeriod, TradePair, PairId, TradingPosition, Exchange
};



pub const HOST_V2 : &str = "https://api-pub.bitfinex.com/v2";

use common::metrics::*;
lazy_static! {
    pub static ref COUNTER_OHLC: IntCounterVec = {
        register_int_counter_vec!("ohlc_ingest", "Number of OHLC received", &["exchange", "pair"]).unwrap()
    };
}
