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

fn auth_req(info: &AuthInfo, path: impl Into<String>, mut body: json::Value) -> StdResult<client::ClientRequest, actix_web::Error> {
    let path = path.into();
    let nonce = unixtime_millis();
    let url = format!("https://api.bitfinex.com{}", path);
    {
        let body = body.as_object_mut().unwrap();
        body.insert("request".into(), json::Value::String(path));
        body.insert("nonce".into(), json::Value::String(format!("{}", nonce)));
    }
    let payload = ::common::base64::encode(&body.to_string());
    let sig = hex(&sha384(&info.secret, &payload));
    client::post(url)
        .header("Content-Type", "application/json")
        .header("Accept", "application/json")
        .header("X-BFX-APIKEY", info.key.clone())
        .header("X-BFX-PAYLOAD", payload)
        .header("X-BFX-SIGNATURE", sig)
        .finish()
}


pub fn wallet_info(auth: AuthInfo) -> impl Future<Item=Vec<WalletInfo>, Error=actix_web::Error> {
    let req = auth_req(&auth, "/v1/balances", json!({})).unwrap();
    let sent = box req.send();
    sent.from_err().and_then(|r| {
        if r.status() != http::StatusCode::OK {
            Either::A(r.body().from_err().and_then(|body| {
                let txt = String::from_utf8_lossy(&body).into_owned();
                future::err::<Vec<WalletInfo>, actix_web::Error>(ErrorUnauthorized(txt).into())
            }))
        } else {
            Either::B(r.json::<Vec<WalletInfo>>().from_err())
        }
    }).from_err()
}


pub fn new_order(auth: AuthInfo, amount: f64, pair: TradePair, buy: bool) -> impl Future<Item=(), Error=actix_web::Error> {
    let new = types::NewOrderPayload {
        amount,
        symbol: pair,
        buy,
    };
    let val = serde_json::to_value(new).unwrap();
    let req = auth_req(&auth, "/v1/order/new", val).unwrap().send();

    req.from_err().and_then(|r| {
        r.body().from_err()
    }).map(|_| ())
}


pub fn order_status(auth: AuthInfo, order_id: i64) -> Result<types::OrderStatus> {
    unimplemented!()
}