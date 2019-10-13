use crate::prelude::*;

pub mod api;
pub mod prelude;
//pub mod dump;
pub mod trade;


fn main() {
    common::init();
    common::ak::rt::System::run(move || {
        let root = async move {
            let client = anats::Client::new("nats://nats:4222").await;


            let _ = trade::BitfinexClient::new(client.clone()).await.unwrap();
            //let _ = dump::BitfinexDumper::new(client.clone()).await.unwrap();

            Ok::<(), ()>(())
        };
        common::ak::rt::spawn(root);
    });
}
