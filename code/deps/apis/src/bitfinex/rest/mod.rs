use crate::prelude::*;

pub mod types;

use common::types::auth::AuthInfo;
use actix_web::{
    self,
    client,
    http,
    HttpMessage,
    Either,
    error::ErrorUnauthorized,
};


use crate::bitfinex::rest::types::WalletInfo;

pub async fn perform_req(info: &AuthInfo,
                         path: impl Into<String>,
                         mut body: json::Value)
                         -> StdResult<client::ClientResponse, actix_web::Error>
{
    let path = path.into();
    let nonce = unixtime_millis();
    println!("Request nonce: {:?}", nonce);
    let url = format!("https://api.bitfinex.com{}", path);
    {
        let body = body.as_object_mut().unwrap();
        body.insert("request".into(), json::Value::String(path));
        body.insert("nonce".into(), json::Value::String(format!("{}", nonce)));
    }
    let body_str = body.to_string();
    let payload = ::common::base64::encode(&body_str);
    let sig = hex(&sha384(&info.secret, &payload));

    let req = client::post(url)
        .header("Content-Type", "application/json")
        .header("Accept", "application/json")
        .header("X-BFX-APIKEY", info.key.clone())
        .header("X-BFX-PAYLOAD", payload)
        .header("X-BFX-SIGNATURE", sig)
        .body(body_str.clone());

    trace!("Bitfinex - REQ : {:?}, body : {:?}", req, body_str);
    let resp = await_compat!(req?.send())?;
    trace!("Bitfinex - RES : {:?}", resp);

    if (resp.status().as_u16() / 100) >= 4 {
        let body = await_compat!(resp.body())?;
        let txt = String::from_utf8_lossy(&body).into_owned();
        return Err(ErrorUnauthorized(txt).into());
    }
    return Ok(resp);
}


pub async fn wallet_info(auth: AuthInfo) -> Result<Vec<WalletInfo>, actix_web::Error> {
    let resp = await_compat!(perform_req(&auth, "/v1/balances", json!({})))?;
    return Ok(await_compat!(resp.json())?);
}


pub async fn new_order(auth: AuthInfo, amount: f64, pair: TradePair, buy: bool) -> Result<types::OrderStatus, actix_web::Error> {
    let new = types::NewOrderPayload {
        amount,
        symbol: pair,
        buy,
    };
    let val = serde_json::to_value(new).unwrap();
    let resp = await_compat!(perform_req(&auth, "/v1/order/new", val))?;
    return Ok(await_compat!(resp.json())?);
}


pub fn order_status(auth: AuthInfo, order_id: i64) -> Result<types::OrderStatus> {
    unimplemented!()
}