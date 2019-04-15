use crate::prelude::*;


#[derive(Debug, Default, Clone, PartialEq, PartialOrd, Deserialize, Serialize)]
pub struct Ticker {
    pub time: u64,
    pub bid: f64,
    pub ask: f64,
    pub last: f64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub bid_qty: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ask_qty: Option<f64>,
}
