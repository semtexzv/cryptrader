pub use common::*;
pub use common::prelude::*;

pub use uuid::Uuid;
pub use db;
pub use db::Database;

pub use common::types::{
    Ohlc, OhlcSpec, OhlcPeriod, TradePair, PairId, TradingPosition,
};


use common::metrics::*;
lazy_static! {
    pub static ref COUNTER_OHLC: IntCounterVec = {
        register_int_counter_vec!("ohlc_ingest", "Number of OHLC received", &["exchange", "pair"]).unwrap()
    };
}
