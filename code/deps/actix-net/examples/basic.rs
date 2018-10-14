extern crate common;
extern crate actix_net;

use common::*;
use actix_net::node::*;

use common::futures::Future;

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Msg {
    i: i32
}

impl Message for Msg {
    type Result = ();
}

impl actix_net::msg::RemoteMessage for Msg {
    fn type_id() -> &'static str {
        "Msg"
    }
}

fn main() {
    let mut sys = common::System::run(|| {

        let a1 = Node::new("tcp://127.0.0.1:48001");
        let a1 = a1.start();

        let a2 = Node::new("tcp://127.0.0.1:48001");
        let a2 = a2.start();

        common::Arbiter::spawn(
            a1.send(actix_net::msg::SendMessage::new(Msg { i: 42 })).map_err(|_| panic!())
        );


        common::Arbiter::spawn(
            a2.send(actix_net::msg::SendMessage::new(Msg { i: 43 })).map_err(|_| panic!())
        );
    });
}