#![feature(box_syntax,associated_type_defaults)]
#![allow(dead_code, unused_variables, unused_imports, unreachable_code)]

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
        let base = actix_net::CommAddr::new("tcp://*:42042").unwrap();

        match matches.subcommand().0 {
            "ingest" => {
                let (ingest, out) = ingest::Ingest::new(base.clone());
                let (rescaler, rout) = ingest::rescaler::Rescaler::new(base.clone(), out);
            }
            "bitfinex" => {
                common::actix::Arbiter::spawn(exch::bitfinex::BitfinexOhlcSource::new(base)
                    .then(|v| {
                        v.unwrap();
                        result(Ok(()))
                    })
                );
            }
            _ => {
                panic!("Not a valid subcommand")
            }
        }
    });
}