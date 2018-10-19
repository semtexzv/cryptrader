#![feature(box_syntax)]
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
    type Result = Result<Msg, String>;
}

impl actix_net::msg::RemoteMessage for Msg {
}

struct Act;

impl Actor for Act {
    type Context = Context<Self>;
}

impl Handler<Msg> for Act {
    type Result = Result<Msg, String>;

    fn handle(&mut self, msg: Msg, ctx: &mut Self::Context) -> <Self as Handler<Msg>>::Result {
        return Err("Something screwed up on this end".into());
    }
}

fn main() {
    use actix_net::comm::*;

    let _ = common::System::run(|| {
        let c1 = Communicator::create("tcp://*:48001").unwrap();

        let c2 = Communicator::create("tcp://*:48002").unwrap();
        let a2 = Act::create(|ctx| Act);
        c2.register::<Msg>(a2.recipient());

        let c3 = Communicator::create("tcp://*:48003").unwrap();

        let c1n2 = c1.connect("tcp://localhost:48002").unwrap();
        let c1n3 = c1.connect("tcp://localhost:48003").unwrap();

        let c2n1 = c2.connect("tcp://localhost:48001").unwrap();
        let c2n3 = c2.connect("tcp://localhost:48003").unwrap();

        let f1 = box c1n2.send(Msg { i: 0 })
            .map(|r| {
                println!("C1 to C2 result : {:?}", r);
                ()
            })
            .map_err(|r| {
                println!("C1 to C2 fail : {:?}", r);
                ()
            });

        Arbiter::spawn(f1);
    });
}