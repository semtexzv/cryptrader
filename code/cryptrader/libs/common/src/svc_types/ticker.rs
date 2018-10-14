use prelude::*;
use mq::{self, MultipartMsg, Multipart, wire_decode, wire_encode};
use types::{
    ticker::Ticker,
    spec::{TradePair, PairId, OhlcSpec},
};

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct TickerUpdate {
    pub ticker: Ticker,
    pub pair: PairId,
}

impl TickerUpdate {
    fn new(pair: impl Into<PairId>, ticker: Ticker) -> Self {
        return TickerUpdate {
            ticker,
            pair: pair.into(),
        };
    }
}

impl mq::MultipartMsg for TickerUpdate {
    fn encode(&self) -> Result<mq::Multipart> {
        let mut path = ::zmq::Message::from(&format!("/ticker/{}/{}",
                                                    self.pair.exchange(), self.pair.pair()));
        let mut msg = ::zmq::Message::from(mq::wire_encode(self)?);
        return Ok(mq::Multipart::from(vec![path, msg]));
    }

    fn decode(data: &mq::Multipart) -> Result<Self> {
        let _ = data.len_eq(2)?;
        return Ok(mq::wire_decode(&data[1])?);
    }
}


#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TickerQuery {
    pub pair: PairId
}

impl MultipartMsg for TickerQuery {
    fn encode(&self) -> Result<Multipart> {
        Ok(
            mq::Multipart::from(zmq::Message::from(wire_encode(self)?))
        )
    }

    fn decode(data: &Multipart) -> Result<Self> {
        Ok(wire_decode(&data[0])?)
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TickerResponse {
    pub query: TickerQuery,
    pub ticker: Option<Ticker>,
}

impl MultipartMsg for TickerResponse {
    fn encode(&self) -> Result<Multipart> {
        Ok(
            mq::Multipart::from(zmq::Message::from(wire_encode(self)?))
        )
    }

    fn decode(data: &Multipart) -> Result<Self> {
        Ok(wire_decode(&data[0])?)
    }
}