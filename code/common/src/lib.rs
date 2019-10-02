#![feature(slice_patterns)]
#![feature(box_syntax)]

pub mod msgs;
pub mod types;
pub mod prelude;
pub mod metrics;

pub use serde;
pub use crate::prelude::*;


pub const BODY_LIMIT: usize = 4 * 1024 * 1024;

pub const CHANNEL_OHLC_INGEST: &str = "ohlc.ingest";
pub const CHANNEL_OHLC_AGG: &str = "ohlc.agg";
pub const CHANNEL_OHLC_RESCALED: &str = "ohlc.rescaled";

pub const GROUP_IMPORT_WORKERS: &str = "workers";
pub const CHANNEL_OHLC_IMPORT: &str = "ohlc.histimport";

pub const CHANNEL_EVAL_REQUESTS: &str = "eval";
pub const CHANNEL_POSITION_REQUESTS: &str = "decision";

pub const CHANNEL_TRADE_REQUESTS: &str = "trade";
pub const CHANNEL_BALANCE_REQUESTS: &str = "balance";

pub const GROUP_EVAL_WORKERS: &str = "workers";


pub fn init() {
    dotenv::dotenv();
    env_logger::init();
    env::set_var("RUST_BACKTRACE", "full");
}