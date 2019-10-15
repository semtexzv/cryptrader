use crate::prelude::*;
use super::ohlc::OhlcPeriod;


#[derive(Debug, Clone, PartialOrd, PartialEq, Ord, Eq, Serialize, Deserialize, Hash)]
pub struct TradePair(pub String, pub String);


impl TradePair {
    pub fn new<T: Into<String>>(tar: T, src: T) -> TradePair {
        let mut tar = tar.into();
        tar.make_ascii_uppercase();
        let mut src = src.into();
        src.make_ascii_uppercase();
        return TradePair(tar, src);
    }

    pub fn bfx_trade_sym(&self) -> String {
        return format!("t{}{}", self.0, self.1);
    }
    /// Parses a 'tBTCUSD' format
    pub fn from_bfx_trade_sym(sym: &str) -> TradePair {
        return TradePair(sym[1..4].to_string(), sym[4..].to_string());
    }

    pub fn to_bfx_pair(&self) -> String {
        return format!("{}{}", self.0, self.1);
    }
    /// Parses a BTCUSD like format
    pub fn from_bfx_pair(pair: &str) -> Self {
        return TradePair((&pair[0..3]).to_string(), (&pair[3..]).to_string());
    }

    pub fn src(&self) -> &str {
        return &self.1;
    }

    pub fn tar(&self) -> &str {
        return &self.0;
    }
}

impl ::std::fmt::Display for TradePair {
    fn fmt(&self, f: &mut ::std::fmt::Formatter) -> ::std::fmt::Result {
        write!(f, "{}:{}", self.0, self.1)
    }
}

impl ::std::str::FromStr for TradePair {
    type Err = Error;

    fn from_str(s: &str) -> StdResult<Self, Self::Err> {
        let vec = s.split(":").collect::<Vec<&str>>();

        return match &vec[..] {
            &[a, b, ..] => {
                Ok(TradePair::new(a, b))
            }
            _ => {
                bail!("Invalid TradePair")
            }
        };
    }
}


#[derive(Debug, Clone, Deserialize, Serialize, PartialOrd, PartialEq, Ord, Eq, Hash)]
pub enum Exchange {
    #[serde(rename = "bitfinex")]
    Bitfinex,
    #[serde(rename = "coinbase")]
    Coinbase,
}

impl Exchange {
    pub const VALUES: &'static [Self] = &[Exchange::Bitfinex, Exchange::Coinbase];
    pub const NAMES: &'static [&'static str] = &["bitfinex", "coinbase"];
}

impl std::fmt::Display for Exchange {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", Self::NAMES[Self::VALUES.iter().position(|v| v == self).unwrap()])
    }
}

impl FromStr for Exchange {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        if let Some(pos) = Self::NAMES.iter().position(|v| v == &s) {
            Ok(Self::VALUES[pos].clone())
        } else { Err(()) }
    }
}

#[derive(Debug, Clone, Deserialize, Serialize, PartialOrd, PartialEq, Ord, Eq, Hash)]
pub struct PairId {
    exch: Exchange,
    pair: TradePair,
}

impl PairId {
    pub fn new(exch: impl Into<Exchange>, pair: impl Into<TradePair>) -> Self {
        return PairId {
            exch: exch.into(),
            pair: pair.into(),
        };
    }
    pub fn exch(&self) -> &Exchange {
        return &self.exch;
    }
    pub fn exchange(&self) -> &Exchange {
        return &self.exch;
    }
    pub fn pair(&self) -> &TradePair {
        return &self.pair;
    }
    pub fn src_currency(&self) -> &str {
        return self.pair.src();
    }
    pub fn tar_currency(&self) -> &str {
        return self.pair.tar();
    }
}


use std::fmt;

impl fmt::Display for PairId {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}/{}", self.exch, self.pair)
    }
}


#[derive(Debug, Clone, Deserialize, Serialize, PartialOrd, PartialEq, Ord, Eq, Hash)]
pub struct OhlcSpec {
    pair: PairId,
    period: OhlcPeriod,
}

impl OhlcSpec {
    pub fn new(exch: impl Into<Exchange>, pair: impl Into<TradePair>, period: impl Into<OhlcPeriod>) -> Self {
        return OhlcSpec {
            pair: PairId::new(exch, pair),
            period: period.into(),
        };
    }
    pub fn new_m(exch: impl Into<Exchange>, pair: impl Into<TradePair>) -> Self {
        return Self::new(exch, pair, OhlcPeriod::Min1);
    }
    pub fn from_pair(pair: impl Into<PairId>, period: impl Into<OhlcPeriod>) -> Self {
        return OhlcSpec {
            pair: pair.into(),
            period: period.into(),
        };
    }
    pub fn from_pair_1m(pair: impl Into<PairId>) -> Self {
        return Self::from_pair(pair, OhlcPeriod::Min1);
    }

    pub fn exch(&self) -> &Exchange {
        return self.pair.exch();
    }
    pub fn exchange(&self) -> &Exchange {
        return self.pair.exch();
    }
    pub fn pair_id(&self) -> &PairId {
        return &self.pair;
    }
    pub fn pair(&self) -> &TradePair {
        return self.pair.pair();
    }
    pub fn src_currency(&self) -> &str {
        return self.pair.src_currency();
    }
    pub fn tar_currency(&self) -> &str {
        return self.pair.tar_currency();
    }
    pub fn period(&self) -> OhlcPeriod {
        return self.period;
    }
    pub fn set_period(&mut self, period: OhlcPeriod) {
        self.period = period;
    }
}

impl fmt::Display for OhlcSpec {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}/{}", self.pair, self.period.to_string())
    }
}


macro_rules! impl_from_ref {
    ($name:ty) => {
        impl<'a> From<&'a $name> for $name {
            fn from(x: &'a $name) -> Self {
                return x.clone();
            }
        }
    };
}
impl_from_ref!(TradePair);