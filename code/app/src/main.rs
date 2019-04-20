#![feature(box_syntax, associated_type_defaults)]
#![feature(await_macro, futures_api, async_await)]
#![feature(impl_trait_in_bindings)]
#![allow(dead_code, unused_variables, unused_imports, unreachable_code, deprecated)]

pub mod prelude;
pub mod exch;
pub mod ingest;
pub mod trader;
pub mod eval;


use crate::prelude::*;

use std::env;
use clap::{App, ArgMatches, SubCommand};
use common::prelude::future::result;
use std::ops::Add;
use actix_arch::balancing::LoadBalancer;
use crate::eval::EvalService;


fn main() {
    use common::actix::spawn as arb_spawn;
    env::set_var("RUST_BACKTRACE", "1");

    fn execute<I, E: Debug, F: 'static  + std::future::Future<Output=Result<I, E>>>(f: F) {
        let res = Compat::new(f);
        common::actix::spawn(res.unwrap_err().drop_item());
    }

    env_logger::Builder::from_default_env().init();

    let matches = App::new("Trader")
        .subcommand(SubCommand::with_name("ingest"))
        .subcommand(SubCommand::with_name("bitfinex"))
        .subcommand(SubCommand::with_name("trader"))
        .subcommand(SubCommand::with_name("eval-balancer"))
        .subcommand(SubCommand::with_name("eval-worker"))
        .get_matches();

    common::actix::System::run(move || {
        let ctx = actix_comm::new_handle();
        let db = db::start();

        match matches.subcommand().0 {
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
                for i in 0..4 {
                    let _ = crate::eval::EvalWorker::new(actix_comm::new_handle(), db.clone());
                }
            }
            _ => {
                panic!("Not a valid subcommannd")
            }
        }
    });
}
