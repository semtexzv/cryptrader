use crate::prelude::*;

pub mod api;
pub mod prelude;
pub mod dump;
pub mod trade;


fn main() {
    common::init();
    common::actix::System::run(move || {
        let root = async move {
            let client = anats::Client::new("nats://nats:4222").await;

            let server = common::actix_web::server::new(||{
                common::metrics::make_exporting_app()
            }).bind("0.0.0.0:9001").unwrap().start();

            let _ = trade::BitfinexClient::new(client.clone()).await.unwrap();
            let _ = dump::BitfinexDumper::new(client.clone()).await.unwrap();

            Ok::<(), ()>(())
        };
        common::actix::spawn(root.boxed_local().compat());
    });
}
