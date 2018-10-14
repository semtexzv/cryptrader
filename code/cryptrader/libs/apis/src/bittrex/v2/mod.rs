use ::prelude::*;

use super::{Res, BittrexOhlc};

pub fn undocumented_ohlc(client: &mut Client, pair: TradePair) -> Result<Res<Vec<BittrexOhlc>>> {
    let url = format!("https://bittrex.com/Api/v2.0/pub/market/GetTicks?marketName={}-{}&tickInterval=oneMin", pair.src(), pair.tar());
    let resp = client.get(&url).build()?;
    return Ok(client.execute(resp)?.json()?);
}

pub fn last_ohlc(client : &mut Client, pair : TradePair) -> Result<Res<Vec<BittrexOhlc>>> {
    let url = format!("https://bittrex.com/Api/v2.0/pub/market/GetLatestTick?marketName={}-{}&tickInterval=oneMin", pair.src(), pair.tar());
    let resp = client.get(&url).build().unwrap();
    return Ok(client.execute(resp).unwrap().json().unwrap());

}