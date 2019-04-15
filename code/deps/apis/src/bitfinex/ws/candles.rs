use crate::prelude::*;
use json;

pub struct CandleSpec(pub String, pub String, pub String);


impl FromStr for CandleSpec {
    type Err = ();

    fn from_str(s: &str) -> StdResult<Self, Self::Err> {
        let v = s.split(":")
            .map(|x| x.to_string())
            .collect::<Vec<String>>();

        return Ok(CandleSpec(v[0].clone(), v[1].clone(), v[2].clone()));
    }
}

impl CandleSpec {
    pub fn interval_str(&self) -> String {
        return self.1.clone();
    }
    pub fn sym_str(&self) -> String {
        return self.2.clone();
    }

}

#[derive(Debug, Clone)]
pub struct BfxCandle {
    pub timestamp: i64,
    pub open: f64,
    pub close: f64,
    pub high: f64,
    pub low: f64,
    pub vol: f64,
}

impl Into<Ohlc> for BfxCandle {
    fn into(self) -> Ohlc {
        Ohlc {
            // Candles timestamps are in seconds
            time: self.timestamp / 1000,
            open : self.open,
            close : self.close,
            high : self.high,
            low : self.low,
            vol : self.vol,
        }
    }
}
impl<'de> Deserialize<'de> for BfxCandle {
    fn deserialize<D>(deserializer: D) -> StdResult<Self, D::Error> where
        D: Deserializer<'de> {
        type Arr = (i64, f64, f64, f64, f64, f64);

        return Arr::deserialize(deserializer).map(|(timestamp, open, close, high, low, vol)| {
            BfxCandle {
                timestamp,
                open,
                close,
                high,
                low,
                vol
            }
        });
    }
}