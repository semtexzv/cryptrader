use prelude::*;

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

#[derive(Serialize, Debug, Clone, Deserialize)]
#[serde(rename = "bitfinex")]
pub struct BitfinexMark;

#[derive(Debug, Clone, )]
pub struct NewOrderPayload {
    pub symbol: TradePair,
    pub amount: f64,
    pub price: f64,
}

impl Serialize for NewOrderPayload {
    fn serialize<S>(&self, serializer: S) -> StdResult<S::Ok, S::Error> where
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

        let mut p = RawPayload {
            symbol: self.symbol.to_bfx_pair(),
            amount: f64::abs(self.amount).to_string(),
            price: self.amount.to_string(),
            exchange: "bitfinex".into(),
            side: (if self.amount > 0.0 { "buy" } else { "sell" }).to_string(),
            typ: "exchange market".into(),
        };
        Serialize::serialize(&p,serializer)
    }
}