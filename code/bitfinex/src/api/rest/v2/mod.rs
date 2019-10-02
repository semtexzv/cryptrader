use crate::prelude::*;
use actix_web::{client::{self, ClientResponse}, HttpMessage};
use crate::api::ws::BfxCandle;

#[derive(Debug,Deserialize)]
enum Config {

}
pub async fn config_exchange_pairs() -> Result<Vec<TradePair>, actix_web::Error> {
    let resp: ClientResponse = client::get(format!("{}/{}", crate::HOST_V2, "/conf/pub:list:pair:exchange"))
        .finish()?
        .send()
        .compat()
        .await?;

    let data: Vec<Vec<String>> = resp.json().compat().await?;
    let data = data.into_iter().flat_map(|p| p.into_iter()).map(|p| {
        TradePair::from_bfx_pair(&p)
    }).collect::<Vec<_>>();


    Ok(data)
}


pub async fn candles_history_until(period: OhlcPeriod, pair: TradePair, count: usize, end: i64) -> Result<Vec<Ohlc>, actix_web::Error> {
    let mut req = client::get(format!("{}/candles/trade:{}:{}/hist?limit={}&end={}", crate::HOST_V2,
                                      period.to_string(),
                                      pair.bfx_trade_sym(),
                                      count,
                                      end * 1000
    ));

    let resp: ClientResponse = req
        .finish()?
        .send()
        .compat()
        .await?;


    let data: Vec<BfxCandle> = resp
        .json()
        .limit(common::BODY_LIMIT)
        .compat().await?;

    Ok(data.into_iter().map(|s| s.into()).collect())
}