#![allow(unused_mut, unused_variables, unused_parens, unused_imports, non_snake_case, dead_code)]
#![feature(const_fn)]
#![feature(custom_attribute)]
#![feature(conservative_impl_trait)]
#![feature(mpsc_select)]
#![feature(try_trait)]
#![feature(never_type)]
#![feature(fs_read_write)]
#![feature(use_nested_groups)]

pub extern crate hmac;
pub extern crate sha2;

pub extern crate serde;
#[macro_use]
pub extern crate serde_json as json;
#[macro_use]
pub extern crate serde_derive;


pub extern crate ta;

#[macro_use]
pub extern crate diesel;
#[macro_use]
pub extern crate diesel_derives;

pub extern crate dotenv;


pub extern crate chrono;
pub extern crate time;
pub extern crate url;
pub extern crate reqwest;
#[macro_use]
pub extern crate common;
pub extern crate wsock;
pub extern crate db;
pub extern crate apis;


pub mod prelude;
pub mod services;

pub mod strategy;
pub mod trade;
pub mod config;


use prelude::*;


use ::common::AppComponent;

fn main() {
    common::configure_logger();
    info!("Starting Trader");


    let mut config = yaml::from_reader::<std::fs::File, config::Config>(std::fs::File::open("./config.yaml").expect("config.yaml could not be opened"))
        .expect("Invalid configuration file");

    assert!(config.strategies.iter().all(|(k, v)| std::path::Path::new(&k).exists()));

    arch::proxy::Proxy::<trade::eval::EvalSvcInfo>::spawn_autorestart();

    for i in 0..3 {
        ::trade::eval::LiveStrategyEvaluator::spawn_autorestart();
    }

    ::services::OhlcService::spawn_autorestart();

    ::trade::exec::StratExecutor::spawn_autorestart();

    let mut trader = ::trade::StratMatcher::new(config)
        .expect("Could not create trader");
    trader.run()
        .expect("Trader error");
    /*

//    let pairs = apis::bitfinex::get_available_pairs();
    let mut trade_spec = &[(TradePair::new("ETH", "USD"), OhlcPeriod::Min15)];

    let mut bfx = ::exchange::bitfinex::Bitfinex::new().unwrap();

    let mut btest = ::exchange::backtest::BackTestExchange::new();
    let mut ttest = ::trade::Trader::new(btest, &trade_spec[..], |p| {
        Box::new(::lua::LuaStrategy::new(include_str!("../../strategies/test.lua")).unwrap())
    }).unwrap();

    ttest.run();
    panic!("TTEST{:#?}", ttest.ex);
    let mut trader = ::trade::Trader::new(bfx, &trade_spec[..], |p| {
        Box::new(::strategy::simple::EmaStrategy::new(10, 10))
    }).unwrap();

    trader.run();
    */
}

