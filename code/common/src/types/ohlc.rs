use crate::prelude::*;
use itertools::Itertools;

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, PartialOrd)]
pub struct Ohlc {
    pub time: i64,
    pub open: f64,
    pub close: f64,
    pub high: f64,
    pub low: f64,
    pub vol: f64,
}


impl Ohlc {
    pub fn combine_with_time(time: i64, values: impl Iterator<Item=Ohlc>) -> Ohlc {
        let mut res = Ohlc::combine(values);
        res.time = time;
        return res;
    }

    pub fn combine(values: impl Iterator<Item=Ohlc>) -> Ohlc {
        let mut time = 0;
        let mut open = 0.0;
        let mut high = 0.0;
        let mut low = 0.0;
        let mut close = 0.0;
        let mut vol = 0.0;
        for (i, v) in values.enumerate() {
            if i == 0 {
                time = v.time;
                open = v.open;
            }
            close = v.close;
            high = f64::max(high, v.high);
            low = f64::min(low, v.low);
            vol += v.vol;
        }
        return Ohlc {
            time,
            open,
            high,
            low,
            close,
            vol,
        };
    }

    pub fn backfill(values: impl Iterator<Item=Ohlc>, period: OhlcPeriod) -> Vec<Ohlc> {
        let mut last = None::<Ohlc>;
        let mut res = vec![];
        let secs = period.seconds();
        for v in values {
            if let Some(last) = last {
                if last.time != v.time - period.seconds() {
                    for i in 0..(last.time - v.time) / period.seconds() {
                        res.push(Ohlc {
                            time: last.time + i * secs,
                            open: last.close,
                            high: last.close,
                            low: last.close,
                            close: last.close,
                            vol: 0.0,
                        });
                    }
                }
            }
            last = Some(v.clone());
            res.push(v);
        }

        return res;
    }

    pub fn rescale(values: impl Iterator<Item=Ohlc>, period: OhlcPeriod) -> Vec<Ohlc> {
        let count = period.seconds() / 60;
        let chunks = values.chunks(count as usize);

        chunks.into_iter().map(|c| {
            Ohlc::combine(c)
        }).collect()
    }

    /*
    pub fn rescale(values: &[Ohlc], period: &OhlcPeriod) -> Vec<Ohlc> {
        if *period == OhlcPeriod::Min1 {
            return Vec::from(values);
        }
        let count = period.seconds() / 60;
        let chunks = values.chunks(count as usize);

        let mut res = vec![];
        for c in chunks {
            res.push(Ohlc::combine(c.iter()));
        }
        return res;
    }
    */
}


/*
impl ta::Open for Ohlc {
    fn open(&self) -> f64 {
        self.open
    }
}

impl ta::High for Ohlc {
    fn high(&self) -> f64 {
        self.high
    }
}

impl ta::Low for Ohlc {
    fn low(&self) -> f64 {
        self.low
    }
}

impl ta::Close for Ohlc {
    fn close(&self) -> f64 {
        self.close
    }
}

impl ta::Volume for Ohlc {
    fn volume(&self) -> f64 {
        self.vol
    }
}

pub struct Indicator<T: ta::Next<f64>> {
    indic: T,
    current: Option<T::Output>,
}

impl<T> Indicator<T>
    where T: ta::Next<f64> + Clone,
          T::Output: Clone
{
    pub fn new(t: T) -> Self {
        return Indicator {
            indic: t,
            current: None,
        };
    }
    pub fn last(&self) -> T::Output {
        self.current.clone().unwrap()
    }
}

impl<T> ta::Next<Ohlc> for Indicator<T>
    where T: ta::Next<f64> + Clone,
          T::Output: Clone
{
    type Output = T::Output;

    fn next(&mut self, input: Ohlc) -> Self::Output {
        use ta::Close;

        self.current = Some(self.indic.next(input.close()));

        return self.current.clone().unwrap();
    }
}
*/

#[derive(Debug, Clone, Copy, PartialEq, Eq, Deserialize, Serialize, PartialOrd, Ord)]
pub enum OhlcPeriod {
    Min1,
    Min5,
    Min10,
    Min15,
    Min30,
    Hour1,
    Hour2,
    Hour3,
    Hour6,
    Hour12,
    Day1,
    Week1,
}

impl ToString for OhlcPeriod {
    fn to_string(&self) -> String {
        let idx = Self::VALUES.iter().position(|ss| ss == self).unwrap();
        Self::NAMES[idx].to_string()
    }
}

impl FromStr for OhlcPeriod {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let idx = Self::NAMES.iter().position(|&ss| ss == s);
        idx.map(|i| Self::VALUES[i]).ok_or(())
    }
}

impl OhlcPeriod {
    pub const VALUES: &'static [OhlcPeriod] = &[
        OhlcPeriod::Min1,
        OhlcPeriod::Min5,
        OhlcPeriod::Min10,
        OhlcPeriod::Min15,
        OhlcPeriod::Min30,
        OhlcPeriod::Hour1,
        OhlcPeriod::Hour2,
        OhlcPeriod::Hour3,
        OhlcPeriod::Hour6,
        OhlcPeriod::Hour12,
        OhlcPeriod::Day1,
        OhlcPeriod::Week1
    ];

    pub const NAMES: &'static [&'static str] = &[
        "1m",
        "5m",
        "10m",
        "15m",
        "30m",
        "1h",
        "2h",
        "3h",
        "6h",
        "12h",
        "1d",
        "7d"
    ];

    pub fn bfx_str(&self) -> String {
        match *self {
            OhlcPeriod::Min1 => "1m",
            OhlcPeriod::Min5 => "5m",
            OhlcPeriod::Min15 => "15m",
            OhlcPeriod::Min30 => "30m",
            OhlcPeriod::Hour1 => "1h",
            OhlcPeriod::Hour3 => "3h",
            OhlcPeriod::Hour6 => "6h",
            OhlcPeriod::Hour12 => "12h",
            OhlcPeriod::Day1 => "1D",
            OhlcPeriod::Week1 => "7D",
            _ => {
                panic!("{:?} not supported by bitfinex", self);
            }
        }.to_string()
    }

    pub fn from_bfx(str: &str) -> Option<Self> {
        match str {
            "1m" => Some(OhlcPeriod::Min1),
            "5m" => Some(OhlcPeriod::Min5),
            "15m" => Some(OhlcPeriod::Min15),
            "30m" => Some(OhlcPeriod::Min30),
            "1h" => Some(OhlcPeriod::Hour1),
            "3h" => Some(OhlcPeriod::Hour3),
            "6h" => Some(OhlcPeriod::Hour6),
            "12h" => Some(OhlcPeriod::Hour12),
            "1D" => Some(OhlcPeriod::Day1),
            "7D" => Some(OhlcPeriod::Week1),
            _ => {
                panic!("{:?} not supported by bitfinex", str);
            }
        }
    }

    pub fn seconds(&self) -> i64 {
        match *self {
            OhlcPeriod::Min1 => 60,
            OhlcPeriod::Min5 => 60 * 5,
            OhlcPeriod::Min10 => 60 * 10,
            OhlcPeriod::Min15 => 60 * 15,
            OhlcPeriod::Min30 => 60 * 30,
            OhlcPeriod::Hour1 => 60 * 60,
            OhlcPeriod::Hour2 => 60 * 60 * 2,
            OhlcPeriod::Hour3 => 60 * 60 * 3,
            OhlcPeriod::Hour6 => 60 * 60 * 6,
            OhlcPeriod::Hour12 => 60 * 60 * 12,
            OhlcPeriod::Day1 => 60 * 60 * 24,
            OhlcPeriod::Week1 => 60 * 60 * 24 * 7,
        }
    }

    pub fn clamp_time(&self, time: i64) -> i64 {
        let s = self.seconds();
        return (time / s) * s;
    }
}

impl ::std::default::Default for OhlcPeriod {
    fn default() -> OhlcPeriod {
        OhlcPeriod::Min1
    }
}