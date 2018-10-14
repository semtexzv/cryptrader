#![allow(unused_mut, unused_variables, unused_parens, unused_imports, non_snake_case, dead_code, unused_attributes)]
#[macro_use]
pub extern crate common;
pub extern crate db;
pub extern crate apis;

#[macro_use]
extern crate serde_derive;

use common::*;
use ::common::prelude::*;
use ::prelude::*;

mod prelude;

pub mod providers;

pub use providers::*;

pub mod ingest;
pub mod exchanges;

pub mod rescaler;
pub mod aggregator;
pub mod exch_proxy;

fn main() {
    common::configure_logger();
    info!("Starting Daemon");

    let mut base = ::ingest::Ingest::spawn_autorestart();

    ::exchanges::bitfinex::BitfinexOhlcProvider::spawn_autorestart();


    /*
    Proxy::<exch_proxy::ExchProxyInfo>::spawn_autorestart();


    let mut rescaler = rescaler::Rescaler::spawn_autorestart();

    aggregator::OhlcAggregator::spawn_autorestart();
    aggregator::TickerAggregator::spawn_autorestart();

    bitfinex::BitfinexOhlcProvider::spawn_autorestart();
    bitfinex::BitfinexExchSvc::spawn_autorestart();

    bittrex::BittrexOhlcHistDumper::spawn_autorestart();
    //bittrex::BittrexOhlcProvider::spawn_autorestart();
    //bittrex::BittrexTickerProvider::spawn_autorestart();
    //bittrex::BittrexExchSvc::spawn_autorestart();

    //bittrex::BittrexLastOhlcProvider::spawn_autorestart();
    //binance::BinanceOhlcProvider::spawn_autorestart();
    //binance::BinanceOhlcHistoryDumper::spawn_autorestart();


    rescaler.join().unwrap();
    */
    base.join().unwrap();

    ::std::thread::park()
}
