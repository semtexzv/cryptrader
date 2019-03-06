pub use std::{
    rc::Rc,
    ops::{Deref, DerefMut},
    borrow::Cow,
    sync::Arc,
    fmt::{self, Debug},
    collections::{
        HashMap, BTreeMap,
        HashSet, BTreeSet,
    },
    str::FromStr,
    marker::PhantomData,
    time::Instant,
    io::{Error as IoError, ErrorKind},
    env,
};

pub use lazy_static::lazy_static;

pub use serde_derive::{Serialize, Deserialize};
pub use serde::{
    Serialize, Deserialize, de::DeserializeOwned, ser::Serializer, de::Deserializer,
};

pub use json::{
    self,
    json,
};

pub use actix::prelude::*;


pub use actix::{
    fut::{
        self as afut,
        wrap_future,
        wrap_stream,
    }
};

pub use url::Url;
pub use log::{log, trace, debug, info, warn, error};
pub use bytes::{Bytes, BytesMut};

pub use failure::{self, bail, format_err, Error};
pub use failure_derive::Fail;

pub use validator::{self, Validate};
pub use validator_derive::Validate;

pub use chrono;
pub use uuid;

pub use futures::{
    prelude::*,
    future,
};

pub type Result<T, E = Error> = std::result::Result<T, E>;

pub use std::result::Result as StdResult;
use time::PreciseTime;


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
    let c = days_to_seconds(28 * 4);
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

pub type BoxFuture<I, E = failure::Error> = Box<dyn Future<Item=I, Error=E> + Send>;

pub trait BTreeMapExt<K, V> {
    fn pop_first(&mut self) -> Option<(K, V)>;
    fn pop_last(&mut self) -> Option<(K, V)>;
}

impl<K: Ord + Clone, V> BTreeMapExt<K, V> for BTreeMap<K, V> {
    fn pop_first(&mut self) -> Option<(K, V)> {
        let k = { self.range(..).next().map(|(k, _v)| k.clone()) };
        k.and_then(|k| self.remove(&k).map(|v| (k, v)))
    }

    fn pop_last(&mut self) -> Option<(K, V)> {
        let k = { self.range(..).last().map(|(k, _v)| k.clone()) };
        k.and_then(|k| self.remove(&k).map(|v| (k, v)))
    }
}


pub fn measure_time<R, F>(f: F) -> (R,i64)
    where F: FnOnce() -> R {
    let t1 = PreciseTime::now();
    let res = f();
    let t2 = PreciseTime::now();

    return (res, t1.to(t2).num_milliseconds())
}




use futures::prelude::*;


pub struct DropErr<F> {
    f: F,
}

impl<F: Future> Future for DropErr<F> {
    type Item = F::Item;
    type Error = ();

    #[inline(always)]
    fn poll(&mut self) -> Result<Async<Self::Item>, Self::Error> {
        match self.f.poll() {
            Ok(a @ _) => Ok(a),
            Err(_) => Err(())
        }
    }
}

pub struct DropItem<F> {
    f: F
}

impl<F: Future> Future for DropItem<F> {
    type Item = ();
    type Error = F::Error;

    #[inline(always)]
    fn poll(&mut self) -> Result<Async<Self::Item>, Self::Error> {
        match self.f.poll() {
            Ok(Async::Ready(_)) => Ok(Async::Ready(())),
            Ok(Async::NotReady) => Ok(Async::NotReady),
            Err(e) => Err(e)
        }
    }
}


pub struct UnwrapErr<F>(F);

impl<F: Future> Future for UnwrapErr<F>
    where F::Error: Debug
{
    type Item = F::Item;
    type Error = ();

    fn poll(&mut self) -> Result<Async<Self::Item>, Self::Error> {
        return Ok(self.0.poll().unwrap());
    }
}

pub struct SetErr<F, E>(F, Option<E>);

impl<F: Future, E> Future for SetErr<F, E> {
    type Item = F::Item;
    type Error = E;

    fn poll(&mut self) -> Result<Async<Self::Item>, Self::Error> {
        match self.0.poll() {
            Ok(a) => Ok(a),
            Err(_) => Err(self.1.take().unwrap())
        }
    }
}

pub trait FutureExt: Future + Sized {
    fn drop_err(self) -> DropErr<Self> {
        return DropErr { f: self };
    }
    fn drop_item(self) -> DropItem<Self> {
        return DropItem { f: self };
    }
    fn unwrap_err(self) -> UnwrapErr<Self> {
        return UnwrapErr(self);
    }
    fn set_err<E>(self, e: E) -> SetErr<Self, E> {
        return SetErr(self, Some(e));
    }
}

impl<F> FutureExt for F where F: Future + Sized {}

pub use self::FutureExt as _;