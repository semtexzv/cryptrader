pub extern crate actix_arch;
pub extern crate actix_net;
pub extern crate common;

pub extern crate clap;

pub mod prelude;
pub mod ingest;


use clap::{App, ArgMatches, SubCommand};

fn main() {
    let matches = App::new("NoName")
        .subcommand(SubCommand::with_name("ingest")
            .about("Run test ingest actor")
        )
        .subcommand(SubCommand::with_name("worker")
            .about("Run test worker actor")
        ).get_matches();

    common::actix::System::run(move || {

        let base = actix_net::base::comm::BaseCommunicator::new("tcp://*:42042").unwrap();

        match matches.subcommand().0 {
            "ingest" => {
                let ingest = ingest::Ingest::new(base);
            },
            _ => {
                panic!("Not a valid subcommand")
            }
        }

    });
}
