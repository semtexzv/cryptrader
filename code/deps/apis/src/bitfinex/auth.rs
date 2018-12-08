use prelude::*;
use json;

#[derive(Serialize, Debug)]
pub struct Auth {
    event: String,
    apiKey: String,
    authSig: String,
    authPayload: String,
    authNonce: String,
}
impl Auth {
    pub fn new(key: String, secret: String) -> Self {
        let n_nonce = super::nonce();

        let nonce = format!("{}", n_nonce);
        let payload = format!("AUTH{}", nonce);

        let sig = sha384(&secret, &payload);

        Auth {
            event: "auth".into(),
            apiKey: key,
            authSig: hex(&sig),
            authNonce: nonce.to_string(),
            authPayload: payload,

        }
    }
}