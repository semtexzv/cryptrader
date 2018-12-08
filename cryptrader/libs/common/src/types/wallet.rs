use ::prelude::*;
use super::spec::TradePair;

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Balance {
    pub available: f64,
    pub total: f64,
    pub min_trade: f64,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Wallet {
    pub balances: BTreeMap<String, Balance>
}

impl Wallet {
    pub fn tar_available(&self, pair: &TradePair) -> f64 {
        return self.available(pair.tar());
    }
    pub fn src_available(&self, pair: &TradePair) -> f64 {
        return self.available(pair.src());
    }
    pub fn src_min(&self, pair: &TradePair) -> f64 {
        return self.min_trade(pair.src());
    }
    pub fn tar_min(&self, pair: &TradePair) -> f64 {
        return self.min_trade(pair.tar());
    }
    pub fn available(&self, cur: &str) -> f64 {
        return self.balances.get(cur).map(|x| x.available).unwrap_or(0.0);
    }
    pub fn min_trade(&self, cur: &str) -> f64 {
        return self.balances.get(cur).map(|x| x.min_trade).unwrap_or(0.0);
    }
}