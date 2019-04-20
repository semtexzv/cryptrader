use crate::prelude::*;
use common::actix_web::{
    client::{self, ClientRequest},
    HttpMessage,
};
use actix_async_await::await;

#[derive(Deserialize, Debug, Clone)]
pub struct BinanceKline {
    #[serde(rename = "e")]
    typ: String,
    #[serde(rename = "E")]
    tim: u64,
    #[serde(rename = "s")]
    sym: String,
    #[serde(rename = "k")]
    val: BinanceOhlc,
}

#[derive(Deserialize, Debug, Clone)]
pub struct BinanceOhlc {
    #[serde(rename = "t")]
    time: u64,
    #[serde(rename = "o")]
    #[serde(deserialize_with = "f64_from_str")]
    open: f64,
    #[serde(rename = "h")]
    #[serde(deserialize_with = "f64_from_str")]
    high: f64,
    #[serde(rename = "l")]
    #[serde(deserialize_with = "f64_from_str")]
    low: f64,
    #[serde(rename = "c")]
    #[serde(deserialize_with = "f64_from_str")]
    close: f64,
    #[serde(rename = "v")]
    #[serde(deserialize_with = "f64_from_str")]
    volume: f64,
    #[serde(rename = "x")]
    finished: bool,
}

impl Into<Ohlc> for BinanceOhlc {
    fn into(self) -> Ohlc {
        return Ohlc {
            time: self.time as _,
            open: self.open,
            high: self.high,
            low: self.low,
            close: self.close,
            vol: self.volume,
        };
    }
}


#[derive(Deserialize, Debug, Clone)]
pub struct BinanceSymbol {
    pub symbol: String,
    #[serde(rename = "baseAsset")]
    pub tar_name: String,
    #[serde(rename = "quoteAsset")]
    pub src_name: String,
}

#[derive(Deserialize, Debug, Clone)]
pub struct BinanceMarkets {
    pub symbols: Vec<BinanceSymbol>
}


fn base_get(path: impl Into<String>) -> StdResult<client::ClientRequest, actix_web::Error> {
    let path = path.into();
    let nonce = unixtime_millis();
    let url = format!("{}{}", super::API_BASE, path);
    client::get(url)
        .header("Content-Type", "application/json")
        .header("Accept", "application/json")
        .finish()
}

pub async fn markets() -> Result<BinanceMarkets, actix_web::Error> {
    let req: ClientRequest = base_get("/api/v1/exchangeInfo")?;
    let res = await!(req.send())?;
    let body: BinanceMarkets = await!(res.json())?;

    unimplemented!()
}
/*
pub fn klines(sym: &TradePair, start: u64) -> Result<Vec<Ohlc>> {
    let url = format!("https://api.binance.com/api/v1/klines?symbol={sym}&interval={interval}&startTime={start}", sym = sym.to_bfx_pair(), interval = "1m", start = start);

    error!("URL : {}", url);
    //println!("SRC: {:?}, TAR: {:?}", pair.src(),pair.tar());
    let client = Client::new();
    let req = client.get(&url).build()?;

    #[derive(Deserialize, Debug, Clone)]
    struct OhlcTuple(u64,
                     #[serde(deserialize_with = "f64_from_str")]
                     f64,
                     #[serde(deserialize_with = "f64_from_str")]
                     f64,
                     #[serde(deserialize_with = "f64_from_str")]
                     f64,
                     #[serde(deserialize_with = "f64_from_str")]
                     f64,
                     #[serde(deserialize_with = "f64_from_str")]
                     f64,
                     u64,
                     String,
                     u64,
                     String,
                     String,
                     String,
    );

    let mut resp = client.execute(req)?;
    return match resp.json::<Vec<OhlcTuple>>() {
        Ok(tuples) => {
            let res: Vec<Ohlc> = tuples.iter().map(|x| {
                let &OhlcTuple(time, open, high, low, close, vol, ..) = x;
                let c = Ohlc {
                    time,
                    open,
                    high,
                    low,
                    close,
                    vol,
                };
                c
            }).collect();

            Ok(res)
        }
        Err(e) => {
            error!("ERR: {}", resp.text()?);
            Err(e.into())
        }
    };
}
*/