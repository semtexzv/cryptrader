#![feature(box_syntax, try_blocks, associated_type_defaults)]
#![feature(checked_duration_since)]
#![feature(never_type)]
#![allow(dead_code, unused_variables, unused_imports, unreachable_code, deprecated)]

pub mod prelude;
pub mod ingest;
pub mod trader;

use crate::prelude::*;

use std::env;


fn main() {
    common::init();
    common::launch(|| async {
        let client = anats::Client::new("nats://nats:4222").await;
        let db = db::start();

        let decider = ingest::decision::Decider::new(client.clone(), db.clone()).await.unwrap();
        let rescaler = ingest::rescaler::Rescaler::new(client.clone(), db.clone()).await.unwrap();
        let ingest = ingest::Ingest::new(client.clone(), db.clone()).await.unwrap();
        let import = ingest::Import::new(client.clone(), db.clone()).await;

    })


}
