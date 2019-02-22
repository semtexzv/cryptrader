#![feature(box_syntax, associated_type_defaults)]
#![allow(dead_code, unused_variables, unused_imports, unreachable_code, deprecated)]

pub mod prelude;
pub mod exch;
pub mod ingest;
pub mod eval;


use crate::prelude::*;

use std::env;
use clap::{App, ArgMatches, SubCommand};
use common::prelude::future::result;


fn main() {
    use futures_util::FutureExt;
    use common::actix::spawn as arb_spawn;
    env::set_var("RUST_BACKTRACE", "1");

    env_logger::Builder::from_default_env().init();

    let matches = App::new("Trader")
        .subcommand(SubCommand::with_name("ingest")
            .about("Run test ingest actor")
        )
        .subcommand(SubCommand::with_name("bitfinex")
            .about("Run Bitfines ohlc source")
        )
        .get_matches();

    common::actix::System::run(move || {
        let ctx = actix_comm::new_handle();

        match matches.subcommand().0 {
            "ingest" => {
                let i2r = actix_arch::proxy::Proxy::new();
                let r2d = actix_arch::proxy::Proxy::new();

                let decider = ingest::decision::Decider::new(ctx.clone(), r2d.clone());
                let rescaler = ingest::rescaler::Rescaler::new(ctx.clone(), i2r.clone(), r2d.clone().recipient());
                let ingest = ingest::Ingest::new(ctx.clone(), i2r.clone().recipient());


                arb_spawn(ingest.unwrap_err().drop_item());
                arb_spawn(rescaler.unwrap_err().drop_item());
                arb_spawn(decider.unwrap_err().drop_item());
            }
            "bitfinex" => {
                common::actix::Arbiter::spawn(exch::bitfinex::BitfinexOhlcSource::new(ctx.clone())
                    .then(|v| {
                        v.unwrap();
                        result(Ok(()))
                    })
                );
            }
            "eval-balancer" => {
                //let balancer = actix_arch::balancing::LoadBalancer::<crate::eval::EvalService>::new();
            }
            "eval-worker" => {}
            _ => {
                panic!("Not a valid subcommannd")
            }
        }
    });
}
