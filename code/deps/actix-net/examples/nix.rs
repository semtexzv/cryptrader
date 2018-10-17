#![allow(unused_mut, unused_imports)]
#![feature(box_syntax)]

extern crate common;
extern crate actix_net;
extern crate nix;

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

impl actix_net::msgs::RemoteMessage for Msg {}


#[derive(Debug, Clone, Serialize, Deserialize)]
struct Msg2 {}

impl Message for Msg2 {
    type Result = ();
}

impl actix_net::msgs::RemoteMessage for Msg2 {}

struct Act;

impl Actor for Act {
    type Context = Context<Self>;
}

impl Handler<Msg> for Act {
    type Result = Result<Msg, String>;

    fn handle(&mut self, msg: Msg, ctx: &mut Self::Context) -> <Self as Handler<Msg>>::Result {
        println!("Handling {:?}", msg);
        return Err("Failed".into());//Ok(Msg { i: msg.i + 1 });
    }
}

fn main() {
    use actix_net::comm::*;
    use actix_net::msgs::*;

    let fr = nix::unistd::fork().unwrap();
    let mut sys = common::System::run(move || {
        let (prefix, local, other, i) = match fr {
            nix::unistd::ForkResult::Parent { .. } => ("PARENT", "tcp://*:48001", "tcp://localhost:48002", 42),
            nix::unistd::ForkResult::Child => ("CHILD", "tcp://*:48002", "tcp://localhost:48001", 52)
        };

        let mut comm = Communicator::create(local).unwrap();
        let node = comm.connect(other).unwrap();

        let act = Act::create(|ctx| Act);
        comm.register::<Msg>(act.clone().recipient());

        let f1 = node.send(Msg { i })
            .then(move |r| {
                let f2 = node.send(Msg2 {}).wait();
                println!("F2: {:?}", f2);

                println!("{:<10}: Response : {:?}", prefix, r);
                comm.register::<Msg>(act.recipient());
                Ok(())
            });


        Arbiter::spawn(f1);
    });
}