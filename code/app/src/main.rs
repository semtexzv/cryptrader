#![feature(box_syntax, try_blocks, associated_type_defaults)]
#![feature(checked_duration_since)]
#![allow(dead_code, unused_variables, unused_imports, unreachable_code, deprecated)]

pub mod prelude;
pub mod ingest;
pub mod trader;
pub mod eval;


use crate::prelude::*;

use std::env;
use clap::{App, ArgMatches, SubCommand};

fn main() {
    common::init();
    let matches = App::new("Trader")
        .subcommand(SubCommand::with_name("core"))
        .subcommand(SubCommand::with_name("evaluator"))
        .get_matches();

    common::actix::System::run(move || {
        let root = async move {
            let client = anats::Client::new("nats://nats:4222").await;
            let db = db::start();

            let server = common::actix_web::server::new(||{
                common::metrics::make_exporting_app()
            }).bind("0.0.0.0:9000").unwrap().start();


            match matches.subcommand().0 {
                "core" => {
                    let decider = ingest::decision::Decider::new(client.clone(), db.clone()).await.unwrap();
                    let rescaler = ingest::rescaler::Rescaler::new(client.clone(), db.clone()).await.unwrap();
                    let ingest = ingest::Ingest::new(client.clone(), db.clone()).await.unwrap();
                    let import = ingest::Import::new(client.clone(), db.clone()).await;
                }
                "evaluator" => {
                    eval::Evaluator::new(client.clone(), db.clone());//.unwrap();
                }
                _ => {
                    panic!("Not a valid subcommannd")
                }
            }
            Ok::<(), ()>(())
        };
        common::actix::spawn(root.boxed_local().compat());
    });
}
