#![allow(unused_mut, unused_variables, unused_parens, unused_imports, non_snake_case, dead_code)]
#![feature(use_extern_macros)]

#[macro_use]
extern crate common;


extern crate hmac;
extern crate sha2;
extern crate reqwest;

extern crate serde;
#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate serde_json as json;

extern crate futures;
#[macro_use]
extern crate hyper;

mod prelude;

pub mod bitfinex;
pub mod bittrex;
pub mod binance;

pub mod cryptocompare;
