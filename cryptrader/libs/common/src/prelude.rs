pub use serde::{Serializer, Serialize, Deserializer, Deserialize,
                de::DeserializeOwned,
};
pub use json::{self, json, json_internal};
pub use regex::{self, Regex};

pub use ::std::result::Result as StdResult;
pub use std::{
    collections::{BTreeMap, HashMap, BTreeSet, HashSet, VecDeque, hash_map, btree_map},
    convert::{TryFrom, TryInto},
    fmt::{self, Debug, Display},
    ops::{Deref, DerefMut},
    str::FromStr,
    string::ToString,
    mem,
    marker::PhantomData,
};

pub use mq::{
    self,
    MultipartMsg,
    SocketExt,
};

pub use futures::prelude::*;
pub use rayon::prelude::*;

pub use log::{error, info, log};

pub use time::{PreciseTime, Duration};

pub use zmq;
pub use ta;

error_chain! {
    foreign_links{
        Ws(::ws::Error);
        Url(::url::ParseError);
        Rlua(::rlua::Error);
        Req(::reqwest::Error);
        Mpsc(::std::sync::mpsc::RecvError);
        Zmq(::zmq::Error);
        MqEnc(::mq::Error);
        Json(::json::Error);
        Io(::std::io::Error);
        Time(::time::OutOfRangeError);
        Regex(::regex::Error);
        //Infallible(::std::convert::Infallible);
    }
}



pub fn unixtime_millis() -> i64 {
    let now = ::chrono::Utc::now();
    return now.timestamp() * 1000 + now.timestamp_subsec_millis() as i64;
}

pub fn unixtime() -> i64 {
    let now = ::chrono::Utc::now();
    return now.timestamp();
}

#[inline(always)]
pub fn min_db_time() -> u64 {
    let n = unixtime() as u64;
    let c = days_to_seconds(28 * 3);
    return n - c;
}

#[inline(always)]
pub fn minutes_to_seconds(m: u64) -> u64 {
    return m * 60;
}

#[inline(always)]
pub fn hours_to_seconds(h: u64) -> u64 {
    return minutes_to_seconds(h * 60);
}

#[inline(always)]
pub fn days_to_seconds(d: u64) -> u64 {
    return hours_to_seconds(d * 24);
}


pub fn id<T>(x: T) -> T { x }

pub fn second<T, S>(x: (T, S)) -> S { x.1 }

pub fn first<T, S>(x: (T, S)) -> T { x.0 }

pub fn clone<T: Clone>(x: &T) -> T { x.clone() }

pub fn deref<T: Copy>(x: &T) -> T { *x }