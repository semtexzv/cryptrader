#![feature(box_syntax, associated_type_defaults)]
#![allow(dead_code, unused_variables, unused_imports, unreachable_code, deprecated)]

pub mod prelude;
pub mod exch;
pub mod ingest;

use crate::prelude::*;

use std::env;
use clap::{App, ArgMatches, SubCommand};
use common::prelude::future::result;


fn main() {
    env::set_var("RUST_BACKTRACE", "1");
    env::set_var("RUST_LOG", "app=trace,debug");


    env_logger::Builder::from_default_env()
        .init();

    let matches = App::new("Trader")
        .subcommand(SubCommand::with_name("ingest")
            .about("Run test ingest actor")
        )
        .subcommand(SubCommand::with_name("bitfinex")
            .about("Run Bitfines ohlc source")
        )
        .subcommand(SubCommand::with_name("web")
            .about("Run web service")
        )
        .get_matches();

    common::actix::System::run(move || {
        let ctx = actix_comm::new_handle();
        println!("CTX: {:?}", ctx.uuid);
        match matches.subcommand().0 {
            "ingest" => {
                let inter = actix_arch::proxy::Proxy::new();

                common::actix::Arbiter::spawn(ingest::Ingest::new(ctx.clone(), inter.clone().recipient())
                    .then(|v| {
                        v.unwrap();
                        result(Ok(()))
                    }));

                let inter2 = actix_arch::proxy::Proxy::new();

                ingest::rescaler::Rescaler::new(ctx.clone(), inter, inter2.clone().recipient());
            }
            "bitfinex" => {
                std::thread::sleep_ms(5000);
                common::actix::Arbiter::spawn(exch::bitfinex::BitfinexOhlcSource::new(ctx.clone())
                    .then(|v| {
                        v.unwrap();
                        result(Ok(()))
                    })
                );
            }
            _ => {
                panic!("Not a valid subcommansd")
            }
        }
    });
}
