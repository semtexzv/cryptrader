#![feature(box_syntax)]
#![allow(unused_mut, unused_variables, unused_parens, unused_imports, non_snake_case, dead_code)]

mod prelude;
pub mod bitfinex;
pub mod binance;

pub const BODY_LIMIT : usize = 2 * 1024 * 1024;