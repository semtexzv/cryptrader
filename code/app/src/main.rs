#![feature(box_syntax, try_blocks, associated_type_defaults)]
#![feature(checked_duration_since)]
#![feature(type_alias_impl_trait)]
#![feature(arbitrary_self_types)]

#![deny(unused_must_use)]
#![allow(dead_code, unused_mut, unused_variables, unused_imports, unreachable_code, deprecated)]

pub mod prelude;
pub mod ingest;
pub mod trader;
pub mod eval;


use crate::prelude::*;

use std::env;
use clap::{App, ArgMatches, SubCommand};
use futures::async_await::pending_once;

fn main() {
    common::init();
    println!("Starting app");

    let matches = App::new("Trader")
        .subcommand(SubCommand::with_name("core"))
        .subcommand(SubCommand::with_name("evaluator"))
        .get_matches();

    common::ak::rt::System::run(|| {
        warn!("Connecting to DB");
        let db = db::start();
        warn!("DB Connected");

        common::ak::rt::spawn(async move {
            let client = anats::Client::new("nats://10.245.79.217:4222").await;

            match matches.subcommand().0 {
                "core" => {
                    let ingest = ingest::Ingest::new(client.clone(), db.clone()).await.unwrap();
                    let import = ingest::Import::new(client.clone(), db.clone()).await;
                    let rescaler = ingest::rescaler::Rescaler::new(client.clone(), db.clone()).await.unwrap();
                    let decider = ingest::decision::Decider::new(client.clone(), db.clone()).await.unwrap();
                    println!("Init done");
                }
                "evaluator" => {
                    eval::Evaluator::new(client.clone(), db.clone());//.unwrap();
                }
                _ => {
                    panic!("Not a valid subcommannd")
                }
            };
        })
    }).unwrap();
}
