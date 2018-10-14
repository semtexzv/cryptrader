pub use common::*;
pub use common::{
    types::{
        spec::{TradePair, PairId, OhlcSpec},
        ohlc::{Ohlc, OhlcPeriod},
        auth::AuthInfo,
    },
    reqwest::{self, Client, ClientBuilder},log
};
pub use std::fmt::Write;

pub fn sha384(secret: &str, data: &str) -> Vec<u8> {
    use hmac::Mac;
    use std::fmt::Write;
    let mut hmac = ::hmac::Hmac::<::sha2::Sha384>::new(secret.as_bytes()).unwrap();
    hmac.input(data.as_bytes());

    Vec::from(hmac.result().code().as_slice())
}


pub fn sha512(secret: &str, data: &str) -> Vec<u8> {
    use hmac::Mac;
    use std::fmt::Write;
    let mut hmac = ::hmac::Hmac::<::sha2::Sha512>::new(secret.as_bytes()).unwrap();
    hmac.input(data.as_bytes());

    Vec::from(hmac.result().code().as_slice())
}


pub fn hex(data: &[u8]) -> String {
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
