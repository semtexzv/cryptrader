#![allow(unused_mut, unused_variables, unused_parens, unused_imports, non_snake_case, dead_code)]
#[macro_use]
extern crate common;


extern crate hmac;
extern crate sha2;

extern crate serde;
#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate serde_json as json;

extern crate futures;

mod prelude;

pub mod bitfinex;

