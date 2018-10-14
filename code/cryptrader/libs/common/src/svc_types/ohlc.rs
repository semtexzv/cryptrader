use prelude::*;
use mq;

use types::{
    ohlc::{Ohlc, OhlcPeriod},
    spec::{TradePair, PairId, OhlcSpec},
};


#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OhlcUpdate {
    pub stable: bool,
    pub spec: OhlcSpec,
    pub ohlc: Ohlc,
}

impl OhlcUpdate {
    pub fn new(id: &PairId, ohlc: impl Into<Ohlc>) -> Self {
        return OhlcUpdate {
            spec: OhlcSpec::new_m(id.exchange(), id.pair()),
            stable: true,
            ohlc: ohlc.into(),
        };
    }

    pub fn new_live(id: &PairId, ohlc: impl Into<Ohlc>) -> Self {
        return OhlcUpdate {
            spec: OhlcSpec::new_m(id.exchange(), id.pair()),
            stable: false,
            ohlc: ohlc.into(),
        };
    }
}

impl mq::MultipartMsg for OhlcUpdate {
    fn encode(&self) -> Result<mq::Multipart> {
        let mut mp = mq::Multipart::new();
        mp.push(&format!("/ohlc/{}/{}/{}/{}\n", if self.stable { "stable" } else { "live" },
                         self.spec.exch(), self.spec.pair(), self.spec.period().to_path_str()));
        mp.push(mq::wire_encode(&self)?);
        Ok(mp)
    }

    fn decode(mut data: &mq::Multipart) -> Result<Self> {
        let _ = data.len_eq(2)?;

        Ok(mq::wire_decode(&data[1])?)
    }
}


#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct OhlcQuery {
    pub start: u64,
    pub end: u64,
    pub spec: OhlcSpec,

}

impl mq::MultipartMsg for OhlcQuery {
    fn encode(&self) -> Result<mq::Multipart> {
        let mut r = mq::Multipart::new();
        r.push_back(zmq::Message::from(&mq::wire_encode(self)?));
        return Ok(r);
    }

    fn decode(data: &mq::Multipart) -> Result<Self> {
        return Ok(mq::wire_decode(&data[0])?);
    }
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct OhlcResponse {
    pub ohlc: Vec<Ohlc>,
    pub query: OhlcQuery,
}


impl mq::MultipartMsg for OhlcResponse {
    fn encode(&self) -> Result<mq::Multipart> {
        let mut r = mq::Multipart::new();
        r.push_back(zmq::Message::from(&mq::wire_encode(self)?));
        Ok(r)
    }

    fn decode(data: &mq::Multipart) -> Result<Self> {
        Ok(mq::wire_decode(&data[0])?)
    }
}
