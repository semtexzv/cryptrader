use crate::prelude::*;

pub mod bitfinex;


pub trait Exchange: Debug + 'static {
    const NAME: &'static str;
    const ENDPOINT: &'static str;
}
