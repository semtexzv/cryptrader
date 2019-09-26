#![feature(box_syntax, try_blocks, associated_type_defaults)]
#![feature(checked_duration_since)]
#![allow(dead_code, unused_variables, unused_imports, unreachable_code, deprecated)]

pub mod prelude;
pub mod exch;
pub mod ingest;
//pub mod trader;
pub mod eval;


use crate::prelude::*;

use std::env;
use clap::{App, ArgMatches, SubCommand};

pub const BODY_LIMIT : usize = 2 * 1024 * 1024;

pub const CHANNEL_OHLC_INGEST: &str = "ohlc.ingest";
pub const CHANNEL_OHLC_AGG: &str = "ohlc.agg";
pub const CHANNEL_OHLC_RESCALED: &str = "ohlc.rescaled";

pub const CHANNEL_EVAL_REQUESTS: &str = "eval";

pub const CHANNEL_TRADE_REQUESTS: &str = "trade";
pub const CHANNEL_BALANCE_REQUESTS: &str = "balance";

pub const GROUP_EVAL_WORKERS: &str = "workers";

fn main() {
    use common::actix::spawn as arb_spawn;
    env::set_var("RUST_BACKTRACE", "full");

    env_logger::Builder::from_default_env().init();

    let matches = App::new("Trader")
        .subcommand(SubCommand::with_name("ingest"))
        .subcommand(SubCommand::with_name("bitfinex"))
        .subcommand(SubCommand::with_name("trader"))
        .subcommand(SubCommand::with_name("evaluator"))
        .get_matches();

    common::actix::System::run(move || {
        let root = async move {
            let client = anats::Client::new("nats://nats:4222").await;
            let db = db::start();

            match matches.subcommand().0 {
                "ingest" => {
                    let decider = ingest::decision::Decider::new(client.clone(), db.clone()).await.unwrap();
                    let rescaler = ingest::rescaler::Rescaler::new(client.clone(), db.clone()).await.unwrap();
                    let ingest = ingest::Ingest::new(client.clone(), db.clone()).await.unwrap();
                }
                "evaluator" => {
                    //eval::Evaluator::new(client.clone(),db.clone());//.unwrap();
                }
                "bitfinex" => {
                     exch::bitfinex::BitfinexClient::new(client.clone()).await.unwrap();
                }
                /*
                    "ingest" => {
                        let i2r = actix_arch::proxy::Proxy::new();
                        let r2d = actix_arch::proxy::Proxy::new();

                        let decider = ingest::decision::Decider::new(ctx.clone(), db.clone(), r2d.clone());
                        let rescaler = ingest::rescaler::Rescaler::new(ctx.clone(), db.clone(), i2r.clone(), r2d.clone().recipient());
                        let ingest = ingest::Ingest::new(ctx.clone(), db.clone(), i2r.clone().recipient());

                        execute(ingest);
                        execute(rescaler);
                        execute(decider);
                    }
                    "bitfinex" => {
                        execute(exch::bitfinex::BitfinexClient::new(ctx.clone()));
                    }
                    "trader" => {
                        let trader = crate::trader::Trader::new(ctx.clone(), db.clone());
                        execute(trader);
                    }

                    "eval-balancer" => {
                        let balancer = actix_arch::balancing::LoadBalancer::<EvalService>::new(ctx.clone());
                        execute(balancer)
                    }

                    "eval-worker" => {
                        for i in 0..20 {
                            let _ = crate::eval::EvalWorker::new(actix_comm::new_handle(), db.clone());
                        }
                    }
                    */
                _ => {
                    panic!("Not a valid subcommannd")
                }
            }
            Ok::<(),()>(())
        };
        common::actix::spawn(root.boxed_local().compat());
    });
}
