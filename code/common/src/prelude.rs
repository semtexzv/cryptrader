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
    time::{Instant, Duration},
    io::{Error as IoError, ErrorKind},
    env,
};

pub use lazy_static::lazy_static;

pub use serde::{Serialize, Deserialize, de::DeserializeOwned, ser::Serializer, de::Deserializer};

pub use serde_json as json;
pub use json::json;

pub use actix::{
    self,
    prelude::*,
    fut::{self as afut, wrap_future, wrap_stream},
};
pub use actix_web;
pub use itertools::Itertools;


pub use url::Url;
pub use log::{log, trace, debug, info, warn, error};
pub use dotenv;
pub use env_logger;
pub use maplit::{hashmap, btreemap, hashset, btreeset};

pub use bytes::{Bytes, BytesMut};

pub use failure::{self, bail, format_err, Error};
pub use failure_derive::{self, Fail};

pub use tokio::{self, util::FutureExt as _};

pub use base64;

pub use chrono;
pub use uuid;
pub use anats;
pub use prometheus;

pub use futures::{self, prelude::*, future};
pub use futures03::compat::Future01CompatExt as _;
pub use futures03::{self, FutureExt as _, TryFutureExt as _};

pub type Result<T, E = Error> = std::result::Result<T, E>;

pub use std::result::Result as StdResult;


pub fn unixtime_millis() -> i64 {
    let now = ::chrono::Utc::now();
    return now.timestamp() * 1000 + (now.timestamp_subsec_millis() as i64) % 1000;
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


pub fn measure_time<R, F>(f: F) -> (R, i64)
    where F: FnOnce() -> R {
    let t1 = Instant::now();
    let res = f();
    let t2 = Instant::now();

    return (res, t2.duration_since(t1).as_millis() as _);
}


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
use crate::types::TradePair;
use actix::dev::ToEnvelope;


pub fn hmac_sha384(secret: &str, data: &str) -> Vec<u8> {
    use hmac::Mac;

    let mut hmac = ::hmac::Hmac::<::sha2::Sha384>::new_varkey(secret.as_bytes()).unwrap();
    hmac.input(data.as_bytes());

    Vec::from(hmac.result().code().as_slice())
}


pub fn hmac_sha512(secret: &str, data: &str) -> Vec<u8> {
    use hmac::Mac;

    let mut hmac = ::hmac::Hmac::<::sha2::Sha512>::new_varkey(secret.as_bytes()).unwrap();
    hmac.input(data.as_bytes());

    Vec::from(hmac.result().code().as_slice())
}


pub fn hex(data: &[u8]) -> String {
    use std::fmt::Write;
    let mut s = String::new();
    for byte in data {
        write!(&mut s, "{:>02x}", byte).expect("Unable to write");
    }
    s
}


pub fn f64_from_str<'de, D>(deserializer: D) -> StdResult<f64, D::Error>
    where D: Deserializer<'de>
{
    let s = <String>::deserialize(deserializer)?;
    f64::from_str(&s).map_err(::serde::de::Error::custom)
}


pub fn f64_from_str_opt<'de, D>(deserializer: D) -> StdResult<Option<f64>, D::Error>
    where D: Deserializer<'de>
{
    let s = <Option<String>>::deserialize(deserializer)?;
    s.map(|s| f64::from_str(&s).map_err(::serde::de::Error::custom)).transpose()
}

pub fn tradepair_from_bfx<'de, D>(deserializer: D) -> StdResult<TradePair, D::Error>
    where D: Deserializer<'de>
{
    let s = <String>::deserialize(deserializer)?;
    Ok(TradePair::from_bfx_pair(&s))
}

pub struct Invoke<A, F, R> (pub F, pub PhantomData<A>)
    where F: FnOnce(&mut A, &mut <A as Actor>::Context) -> R + Send + 'static,
          A: Actor,
          R: Send + 'static;

impl<A, F, R> Message for Invoke<A, F, R>
    where F: FnOnce(&mut A, &mut <A as Actor>::Context) -> R + Send + 'static,
          A: Actor,
          R: Send + 'static, {
    type Result = Result<R, ()>;
}

unsafe impl<A, F, R> Send for Invoke<A, F, R>
    where F: FnOnce(&mut A, &mut <A as Actor>::Context) -> R + Send + 'static,
          A: Actor,
          R: Send + 'static {}

pub trait ActorExt<F, R>: Actor
    where F: FnOnce(&mut Self, &mut Self::Context) -> R + Send + 'static,
          R: Send + 'static,
          Self: Handler<Invoke<Self, F, R>>,
          Self::Context: ToEnvelope<Self, Invoke<Self, F, R>>
{
    fn invoke(addr: Addr<Self>, f: F) -> futures03::future::LocalBoxFuture<'static, R>
    {
        async move {
            let invoke = Invoke(f, PhantomData);
            let res = addr.send(invoke).compat().await.unwrap().unwrap();
            res
        }.boxed_local()
    }
}

pub trait AddrExt<A, F, R>
    where A: Actor + Handler<Invoke<A, F, R>>,
          F: FnOnce(&mut A, &mut A::Context) -> R + Send + 'static,
          R: Send + 'static,
          A::Context: ToEnvelope<A, Invoke<A, F, R>> {
    fn invoke(&self, f: F) -> futures03::future::LocalBoxFuture<'static, R>;
}

impl<A, F, R> AddrExt<A, F, R> for Addr<A>
    where A: Actor + Handler<Invoke<A, F, R>>,
          F: FnOnce(&mut A, &mut A::Context) -> R + Send + 'static,
          R: Send + 'static,
          A::Context: ToEnvelope<A, Invoke<A, F, R>> {
    fn invoke(&self, f: F) -> futures03::future::LocalBoxFuture<'static, R> {
        let addr = self.clone();
        async move {
            let invoke = Invoke(f, PhantomData);
            let res = addr.send(invoke).compat().await.unwrap().unwrap();
            res
        }.boxed_local()
    }
}


impl<A, F, R> ActorExt<F, R> for A
    where Self: Actor + Handler<Invoke<A, F, R>>,
          F: FnOnce(&mut Self, &mut Self::Context) -> R + Send + 'static,
          R: Send + 'static,
          Self: Handler<Invoke<Self, F, R>>,
          Self::Context: ToEnvelope<Self, Invoke<Self, F, R>>
{}

#[macro_export]
macro_rules! impl_invoke {
    ($ty:ty) => {
        impl<F, R> Handler<Invoke<Self, F, R>> for $ty
            where F: FnOnce(&mut Self, &mut <Self as Actor>::Context) -> R + Send + 'static,
                  R: Send + 'static, {
            type Result = Result<R, ()>;

            fn handle(&mut self, msg: Invoke<Self, F, R>, ctx: &mut Self::Context) -> Self::Result {
                return Ok(msg.0(self, ctx));
            }
        }
    };
}
