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


pub use itertools::Itertools;


pub use url::Url;
pub use log::{log, trace, debug, info, warn, error};
pub use dotenv;
pub use env_logger;
pub use maplit::{hashmap, btreemap, hashset, btreeset};

pub use bytes::{Bytes, BytesMut};

pub use failure::{self, bail, format_err, Error};
pub use failure_derive::{self, Fail};

pub use base64;

pub use chrono;
pub use uuid;
pub use anats;
pub use prometheus;
pub type Result<T, E = Error> = std::result::Result<T, E>;

pub use ak;
pub use ak::*;
pub use ak::context::*;
pub use ak::actor::*;
pub use ak::addr::*;

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


use crate::types::TradePair;


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


pub fn f64_from_str<'de, D>(deserializer: D) -> Result<f64, D::Error>
    where D: Deserializer<'de>
{
    let s = <String>::deserialize(deserializer)?;
    f64::from_str(&s).map_err(::serde::de::Error::custom)
}


pub fn f64_from_str_opt<'de, D>(deserializer: D) -> Result<Option<f64>, D::Error>
    where D: Deserializer<'de>
{
    let s = <Option<String>>::deserialize(deserializer)?;
    s.map(|s| f64::from_str(&s).map_err(::serde::de::Error::custom)).transpose()
}

pub fn tradepair_from_bfx<'de, D>(deserializer: D) -> Result<TradePair, D::Error>
    where D: Deserializer<'de>
{
    let s = <String>::deserialize(deserializer)?;
    Ok(TradePair::from_bfx_pair(&s))
}

pub use ak::{Actor, Handler, Message};
use futures::future::LocalBoxFuture;
use futures::FutureExt;

pub struct Invoke<A, F, R> (pub F, pub PhantomData<A>)
    where F: FnOnce(&mut ContextRef<A>) -> R + Send + 'static,
          A: Actor,
          R: Send + 'static;

impl<A, F, R> Message for Invoke<A, F, R>
    where F: FnOnce(&mut ContextRef<A>) -> R + Send + 'static,
          A: Actor,
          R: Send + 'static, {
    type Result = R;
}

unsafe impl<A, F, R> Send for Invoke<A, F, R>
    where F: FnOnce(&mut ContextRef<A>) -> R + Send + 'static,
          A: Actor,
          R: Send + 'static {}

pub trait ActorExt<F, R>: Actor
    where F: FnOnce(&mut ContextRef<Self>) -> R + Send + 'static,
          R: Send + 'static,
          Self: Handler<Invoke<Self, F, R>>,
{
    fn invoke(addr: Addr<Self>, f: F) -> LocalBoxFuture<'static, R>
    {
        async move {
            let invoke = Invoke(f, PhantomData);
            let res = addr.send(invoke).await.unwrap();
            res
        }.boxed_local()
    }
}

pub trait AddrExt<A, F, R>
    where A: Actor + Handler<Invoke<A, F, R>>,
          F: FnOnce(&mut ContextRef<A>) -> R + Send + 'static,
          R: Send + 'static, {
    fn invoke(&self, f: F) -> futures::future::LocalBoxFuture<'static, R>;
}

impl<A, F, R> AddrExt<A, F, R> for Addr<A>
    where A: Actor + Handler<Invoke<A, F, R>>,
          F: FnOnce(&mut ContextRef<A>) -> R + Send + 'static,
          R: Send + 'static, {
    fn invoke(&self, f: F) -> futures::future::LocalBoxFuture<'static, R> {
        let addr = self.clone();
        async move {
            let invoke = Invoke(f, PhantomData);
            let res = addr.send(invoke).await.unwrap();
            res
        }.boxed_local()
    }
}


impl<A, F, R> ActorExt<F, R> for A
    where Self: Actor + Handler<Invoke<A, F, R>>,
          F: FnOnce(&mut ContextRef<A>) -> R + Send + 'static,
          R: Send + 'static,
          Self: Handler<Invoke<Self, F, R>>,

{}

#[macro_export]
macro_rules! impl_invoke {
    ($ty:ty) => {
        impl<F, R> Handler<Invoke<Self, F, R>> for $ty
            where F: FnOnce(&mut ContextRef<$ty>) -> R + Send + 'static,
                  R: Send + 'static, {

            type Future = impl std::future::Future<Output=R>;

            fn handle(mut self : ContextRef<$ty>, msg: Invoke<Self, F, R>) -> Self::Future {
                async move {
                    return msg.0(&mut self);
                }
            }
        }
    };
}
