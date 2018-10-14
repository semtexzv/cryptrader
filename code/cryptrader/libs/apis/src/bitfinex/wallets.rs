use ::prelude::*;
use json;

#[derive(Debug,Clone)]
pub struct WalletInfo {
    pub typ: String,
    pub currency: String,
    pub balance: f64,
    pub interest: f64,
    pub available: Option<f64>,
}

impl<'de> Deserialize<'de> for WalletInfo {
    fn deserialize<D>(deserializer: D) -> StdResult<Self, D::Error> where
        D: Deserializer<'de> {
        type Arr = (String, String, f64, f64, Option<f64>);

        Arr::deserialize(deserializer).map( | (typ, currency, balance, interest, available) | {
            WalletInfo {
                typ,
                currency,
                balance,
                interest,
                available
            }
        })
    }
}