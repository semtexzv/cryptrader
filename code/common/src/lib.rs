#![feature(slice_patterns)]
#![feature(box_syntax)]

pub mod msgs;
pub mod types;
pub mod prelude;
pub mod metrics;

pub use log;
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

pub fn launch<F, Fut>(f: F)
    where F: FnOnce() -> Fut + 'static,
          Fut: std::future::Future<Output=()> + 'static
{
    actix::System::run(move || {
        let _server = actix_web::server::new(|| {
            metrics::make_exporting_app()
        }).bind("0.0.0.0:9000").unwrap().start();

        let fut = f();
        let fut = async {
            fut.await;
            Ok::<_, ()>(())
        }.boxed_local();

        actix::spawn(fut.compat());
    });
}