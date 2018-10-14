use ::prelude::*;

pub mod types;

use reqwest::{
    self,
    Client,
    header::{self},
};

use ::common::hyper;

header! { (BfxApiKey,"X-BFX-APIKEY") => [String] }
header! { (BfxPayload,"X-BFX-PAYLOAD") => [String] }
header! { (BfxSignature,"X-BFX-SIGNATURE") => [String] }

fn auth_req_v1(client: &mut reqwest::Client, info: &::common::types::auth::AuthInfo, path: impl Into<String>, mut body: json::Value) -> Result<reqwest::Request> {
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

    Ok(client.request(reqwest::Method::Post, ::common::url::Url::parse(&url)?)
        .header(header::ContentType::json())
        .header(header::Accept::json())
        .header(BfxApiKey(info.key.clone()))
        .header(BfxPayload(payload))
        .header(BfxSignature(sig))
        .build()?
    )
}


pub struct ApiClient {
    cl: reqwest::Client,
}

impl ApiClient {
    pub fn new() -> Self {
        return ApiClient {
            cl: reqwest::Client::new()
        };
    }
    pub fn balances(&mut self, auth: &::common::types::auth::AuthInfo) -> Result<Vec<types::WalletInfo>> {
        let req = auth_req_v1(&mut self.cl, &auth, "/v1/balances", json!({}))?;
        let mut res = self.cl.execute(req);
        match res {
            Ok(mut response) => {
                // error!("Returned : {:?}", response.text());
                return Ok(response.json()?);
            }
            Err(err) => {
                error!("Error occured in api call : {:?}", err);
                return Err(err.into());
            }
        }
    }

    pub fn create_order(&mut self, auth: &AuthInfo, order: types::NewOrderPayload) -> Result<()> {
        let req = auth_req_v1(&mut self.cl, &auth, "/v1/balances", json::to_value(&order)?)?;
        let mut res = self.cl.execute(req)?;

        Ok(())
    }
}
