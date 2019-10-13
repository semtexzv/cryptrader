use crate::prelude::*;


#[derive(Serialize)]
pub enum OrderType {
    #[serde(rename = "MARKET")]
    Market,
    #[serde(rename = "EXCHANGE MARKET")]
    ExchMarket,
    #[serde(rename = "LIMIT")]
    Limit,
    #[serde(rename = "EXCHANGE LIMIT")]
    ExchLimit,
    #[serde(rename = "STOP")]
    Stop,
    #[serde(rename = "EXCHANGE STOP")]
    ExchStop,
    #[serde(rename = "TRAILING STOP")]
    TrailStop,
    #[serde(rename = "EXCHANGE TRAILING STOP")]
    ExcTrailStop,
    #[serde(rename = "FOK")]
    Fok,
    #[serde(rename = "EXCHANGE FOK")]
    ExchFok,
    #[serde(rename = "STOP LIMIT")]
    StopLimit,
    #[serde(rename = "EXCHANGE STOP LIMIT")]
    ExchStopLimit,

}



#[derive(Serialize)]
pub struct NewOrder {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub gid: Option<i32>,
    pub cid: u64,

    #[serde(rename = "type")]
    pub   typ: OrderType,
    pub   symbol: String,
    pub    amount: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub  price: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub  price_trailing: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub  price_aux_limit: Option<String>,
    pub hidden: i32,
    pub  postonly: i32,
}

pub struct NewOrderMsg {
    ord: NewOrder
}

impl Serialize for NewOrderMsg {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error> where
        S: Serializer {
        return (0, "on", None as Option<i32>, &self.ord).serialize(serializer);
    }
}


impl Into<NewOrderMsg> for NewOrder {
    fn into(self) -> NewOrderMsg {
        return NewOrderMsg { ord: self };
    }
}
