use crate::prelude::*;
use hyper::{client::Client, Response, Body};
use common::types::auth::AuthInfo;


#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SymbolDetail {
    pub pair: String,
    pub price_precision: usize,
    #[serde(deserialize_with = "f64_from_str")]
    pub minimum_order_size: f64,
}

pub async fn get_available_symbols() -> Result<Vec<SymbolDetail>, failure::Error> {
    let req = client().get("https://api.bitfinex.com/v1/symbols_details".parse().unwrap()).await?;
    let res = req.send().compat().await.unwrap();
    let body: Vec<SymbolDetail> = res.json().limit(crate::BODY_LIMIT).compat().await.unwrap();

    Ok(body)
}


pub async fn req_v1(info: &AuthInfo,
                    path: impl Into<String>,
                    mut body: json::Value)
                    -> Result<Response<Body>, hyper::Error>
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
    let sig = hex(&hmac_sha384(&info.secret, &payload));

    let mut req = client().post(url.parse())
        .header("Content-Type", "application/json")
        .header("Accept", "application/json")
        .header("X-BFX-APIKEY", info.key.clone())
        .header("X-BFX-PAYLOAD", payload)
        .header("X-BFX-SIGNATURE", sig)
        .finish().unwrap();
    req.set_body(body_str.clone());


    let resp = req.send().compat().await?;
    trace!("Bitfinex - RES : {:?}", resp);

    if (resp.status().as_u16() / 100) >= 4 {
        let body = resp.body().compat().await?;
        let txt = String::from_utf8_lossy(&body).into_owned();
        panic!("Not autohorized");
    }
    return Ok(resp);
}


#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WalletInfo {
    #[serde(rename = "type")]
    pub typ: String,
    pub currency: String,
    #[serde(deserialize_with = "f64_from_str")]
    pub amount: f64,
    #[serde(deserialize_with = "f64_from_str")]
    pub available: f64,
}

pub async fn wallet_info(auth: AuthInfo) -> Result<Vec<WalletInfo>> {
    let resp = req_v1(&auth, "/v1/balances", json!({})).await?;
    return Ok(resp.json().compat().await?);
}


#[derive(Debug, Clone, )]
pub struct NewOrderPayload {
    pub symbol: TradePair,
    pub amount: f64,
    pub buy: bool,
}

impl Serialize for NewOrderPayload {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error> where
        S: Serializer {
        #[derive(Debug, Clone, Serialize, Deserialize)]
        pub struct RawPayload {
            symbol: String,
            amount: String,
            price: String,
            exchange: String,
            side: String,
            #[serde(rename = "type")]
            typ: String,
        }

        let p = RawPayload {
            symbol: self.symbol.to_bfx_pair(),
            amount: f64::abs(self.amount).to_string(),
            price: 1.to_string(),
            exchange: "bitfinex".into(),
            side: (if self.buy { "buy" } else { "sell" }).to_string(),
            typ: "exchange market".into(),
        };
        Serialize::serialize(&p, serializer)
    }
}


#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OrderStatus {
    pub id: usize,

    #[serde(rename = "symbol")]
    #[serde(deserialize_with = "tradepair_from_bfx")]
    pub pair: TradePair,
    pub exchange: String,

    #[serde(deserialize_with = "f64_from_str")]
    pub price: f64,

    pub side: String,
    #[serde(rename = "type")]
    pub typ: String,

    pub is_live: bool,
    pub is_cancelled: bool,
    pub is_hidden: bool,

    #[serde(deserialize_with = "f64_from_str")]
    pub original_amount: f64,

    #[serde(deserialize_with = "f64_from_str")]
    pub remaining_amount: f64,

    #[serde(deserialize_with = "f64_from_str")]
    pub executed_amount: f64,

}

pub async fn new_order(auth: AuthInfo, amount: f64, pair: TradePair, buy: bool) -> Result<OrderStatus> {
    let new = NewOrderPayload {
        amount,
        symbol: pair,
        buy,
    };
    let val = json::to_value(new).unwrap();
    let resp = req_v1(&auth, "/v1/order/new", val).await?;
    return Ok(resp.json().compat().await?);
}

