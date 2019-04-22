pub use std::env;
pub use common::{
    prelude::*,
    time::PreciseTime,
    types::{
        TradePair, PairId, OhlcSpec, OhlcPeriod, Ohlc,
    },
};

pub use diesel::prelude::*;
pub(crate) use diesel::sql_types::{Text, BigInt};


pub(crate) use crate::{DbWorker, ConnType, schema};

pub use schema::{User, Strategy, Assignment, Evaluation, Trader};

pub(crate) type BoxFuture<I, E = diesel::result::Error> = Box<Future<Item=I, Error=E>>;