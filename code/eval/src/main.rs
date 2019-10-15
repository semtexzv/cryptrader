pub mod act;
use common::log::*;
use common::anats;

fn main() {
    common::init();
    println!("Starting eval");
    common::launch(|| async {
        let client = anats::Client::new("nats://nats:4222").await;
        let db = db::start();

        let _ = act::Evaluator::new(client,db).await;

    });
}
