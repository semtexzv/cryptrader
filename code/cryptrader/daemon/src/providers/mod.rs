use prelude::*;
use common::*;

pub mod bitfinex;
pub mod bittrex;
pub mod binance;


#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RawOhlc {
    pub spec: OhlcSpec,
    pub ohlc: Vec<Ohlc>,
}


impl mq::MultipartMsg for RawOhlc {
    fn encode(&self) -> Result<mq::Multipart> {
        let mut mp = mq::Multipart::new();
        mp.push(&format!("/ohlc/raw/{}/{}", self.spec.exch(), self.spec.pair()));
        mp.push(mq::wire_encode(&self)?);
        Ok(mp)
    }

    fn decode(data: &mq::Multipart) -> Result<Self> {
        let _ = data.len_eq(2)?;

        Ok(mq::wire_decode(&data[1])?)
    }
}


pub struct OhlcProvider {
    pub context: zmq::Context,
    pub socket: zmq::Socket,
}

impl OhlcProvider {
    pub fn new() -> Result<OhlcProvider> {
        let mut context = ::common::ZMQ_CONTEXT.clone();
        let mut socket = context.socket(zmq::SocketType::PUB)?;
        socket.connect(mq::ENDPOINT_AGGR_IN)?;
        Ok(OhlcProvider {
            context,
            socket,
        })
    }

    pub fn update(&self, spec: &OhlcSpec, ohlc: &[Ohlc]) -> Result<()> {
        let mut ohlc = Vec::from(ohlc);
        ohlc.sort_by_key(|x| x.time);
        let mut update = RawOhlc {
            spec: spec.clone(),
            ohlc: Vec::from(ohlc),
        };
        let mut msg = update.encode()?;
        self.socket.send_mp(msg)?;

        Ok(())
    }
}

pub struct TickerProvider {
    pub context: zmq::Context,
    pub socket: zmq::Socket,
}

impl TickerProvider {
    pub fn new() -> Result<TickerProvider> {
        let mut context = ::common::ZMQ_CONTEXT.clone();
        let mut socket = context.socket(zmq::SocketType::PUB)?;
        socket.connect(mq::ENDPOINT_TICKER_AGGR_IN)?;
        Ok(TickerProvider {
            context,
            socket,
        })
    }

    pub fn update(&self, pair_id: PairId, ticker: Ticker) -> Result<()> {
        let mut update = TickerUpdate {
            pair: pair_id,
            ticker: ticker,
        };
        let mut msg = update.encode()?;
        self.socket.send_mp(msg)?;

        Ok(())
    }
}

use common::svc_types::exch::{
    ExchQuery, ExchReply,
    WalletQuery, WalletReply,
};

pub type ExchangeWorker = ServiceWorker<super::exch_proxy::ExchProxyInfo>;

