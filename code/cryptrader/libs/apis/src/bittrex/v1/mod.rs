use ::prelude::*;
/*

fn auth_req_v1(client: &mut reqwest::Client, auth: AuthInfo, path: impl Into<String>, mut body: json::Value) -> Result<reqwest::Request> {
    let url = if path.contains('?') {
        format!("https://bittrex.com{path}&apikey={key}&nonce={nonce}", path = path.into(), key = auth.key, nonce = nonce);
    } else {
        format!("https://bittrex.com{path}?apikey={key}&nonce={nonce}", path = path.into(), key = auth.key, nonce = nonce);
    };
    //let sign =
    unimplemented!()
}

pub fn auth_req_v11(cl: &mut reqwest::Client, auth: AuthInfo) -> Result<reqwest::Request> {
    let nonce = unixtime_millis();
    //let uri
    unimplemented!()
}*/