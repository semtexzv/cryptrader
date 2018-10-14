#![allow(unused_mut, unused_variables, unused_parens, unused_imports, non_snake_case, dead_code)]
#![feature(proc_macro, generators)]
#![feature(use_extern_macros)]

#![feature(slice_patterns)]
#![feature(try_from)]
#![feature(specialization)]
#![recursion_limit="256"]

#[macro_use]
pub extern crate rand;

#[macro_use]
pub extern crate error_chain;

#[macro_use]
pub extern crate lazy_static;
#[macro_use]

pub extern crate maplit;

#[macro_use]
pub extern crate regex;

#[macro_use]
pub extern crate log;
pub extern crate log4rs;

pub extern crate rlua;

pub extern crate ws;
pub extern crate ta;
pub extern crate url;
pub extern crate reqwest;
#[macro_use]
pub extern crate hyper;
pub extern crate base64;


pub extern crate serde;
#[macro_use]
pub extern crate serde_json as json;
pub extern crate serde_yaml as yaml;

#[macro_use]
pub extern crate rmp_serde as rmp;
#[macro_use]
pub extern crate serde_derive;

pub extern crate chrono;
pub extern crate time;
pub extern crate zmq;

pub extern crate futures_await as futures;
pub extern crate rayon;


pub mod prelude;
pub mod util;
pub mod mq;
pub mod arch;

pub mod types;
pub mod svc_types;

pub use prelude::*;
pub use util::*;

lazy_static! {
    pub static ref ZMQ_CONTEXT : zmq::Context = {
        zmq::Context::new()
    };
}

pub trait AppComponent: Sized {
    fn new(ctx: ::zmq::Context) -> Result<Self>;
    fn run(self) -> Result<()>;
    fn spawn() -> ::std::thread::JoinHandle<()> {
        ::std::thread::spawn(|| {
            let mut component = Self::new(ZMQ_CONTEXT.clone())
                .expect("Could not create a component");
            component.run().expect("Component has crashed");
        })
    }
    fn spawn_autorestart() -> ::std::thread::JoinHandle<()> {
        ::std::thread::spawn(|| {
            loop {
                let x = Self::spawn();
                if let Err(e) = x.join(){
                    error!("Thread panicked : {:?}",e);
                }
                ::std::thread::sleep(::std::time::Duration::from_secs(5));
            }
        })
    }
}
