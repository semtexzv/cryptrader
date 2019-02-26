pub use common::prelude::*;
pub use common::{
    types::{
        TradePair, PairId, OhlcSpec, Ohlc, OhlcPeriod,
        auth::AuthInfo,
    },
};
pub use std::str::FromStr;
pub use std::fmt::Write;

pub fn sha384(secret: &str, data: &str) -> Vec<u8> {
    use hmac::Mac;
    use std::fmt::Write;
    let mut hmac = ::hmac::Hmac::<::sha2::Sha384>::new_varkey(secret.as_bytes()).unwrap();
    hmac.input(data.as_bytes());

    Vec::from(hmac.result().code().as_slice())
}


pub fn sha512(secret: &str, data: &str) -> Vec<u8> {
    use hmac::Mac;
    use std::fmt::Write;
    let mut hmac = ::hmac::Hmac::<::sha2::Sha512>::new_varkey(secret.as_bytes()).unwrap();
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


pub fn f64_from_str_opt<'de, D>(deserializer: D) -> StdResult<Option<f64>, D::Error>
    where D: Deserializer<'de>
{
    let s = <Option<String>>::deserialize(deserializer)?;
    s.map(|s| f64::from_str(&s).map_err(::serde::de::Error::custom)).transpose()
}
