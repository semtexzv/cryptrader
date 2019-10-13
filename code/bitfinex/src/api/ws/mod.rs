pub mod auth;
pub mod candles;
pub mod wallets;
pub mod order;


use crate::prelude::*;
use std::convert::TryFrom;
use hyper_ws::Message as WsMessage;
use json;

pub use self::auth::*;
pub use self::candles::*;
use common::types::{
    ticker::Ticker,
};

/*
#[derive(Debug, Clone)]
pub struct Msg(pub i32, pub String, pub json::Value);

impl<'de> Deserialize<'de> for Msg {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error> where
        D: Deserializer<'de> {
        #[derive(Deserialize)]
        #[serde(untagged)]
        enum Tst {
            Empty(i32, String),
            Simple(i32, json::Value),
            Identified(i32, String, json::Value),
        };

        return Tst::deserialize(deserializer).map(|x| {
            return match x {
                Tst::Empty(id, t) => {
                    Msg(id, t, json::Value::Null)
                }
                Tst::Simple(id, v) => {
                    Msg(id, "".into(), v)
                }
                Tst::Identified(id, t, v) => {
                    Msg(id, t, v)
                }
            };
        });
    }
}


#[derive(Serialize)]
pub struct Sub {
    pub event: String,
    pub channel: String,
    pub symbol: String,
}

type NotifArray = (i32, json::Value);

pub struct Notif {
    pub id: i32,
    pub value: json::Value,
}

impl<'de> Deserialize<'de> for Notif {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error> where
        D: Deserializer<'de> {
        return NotifArray::deserialize(deserializer)
            .map(
                |(id, value)| Notif {
                    id,
                    value,
                });
    }
}


pub type HB = (i32, String);
pub type TickerArray = (f64, f64, f64, f64, f64, f64, f64, f64, f64, f64);

#[derive(Debug, Clone, Default)]
pub struct TickerData {
    pub bid: f64,
    pub bid_size: f64,
    pub ask: f64,
    pub ask_size: f64,
    pub daily_diff: f64,
    pub daily_perd: f64,
    pub last_price: f64,
    pub vol: f64,
    pub high: f64,
    pub low: f64,
}

impl Into<Ticker> for TickerData {
    fn into(self) -> Ticker {
        return Ticker {
            time: unixtime() as _,
            bid: self.bid,
            ask: self.ask,
            last: self.last_price,
            bid_qty: self.bid_size.into(),
            ask_qty: self.ask_size.into(),
        };
    }
}

impl<'de> Deserialize<'de> for TickerData {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error> where
        D: Deserializer<'de> {
        return TickerArray::deserialize(deserializer)
            .map(
                |(bid,
                     bid_size,
                     ask,
                     ask_size,
                     daily_diff,
                     daily_perd,
                     last_price,
                     vol,
                     high,
                     low)| {
                    TickerData {
                        bid,
                        bid_size,
                        ask,
                        ask_size,
                        daily_diff,
                        daily_perd,
                        last_price,
                        vol,
                        high,
                        low,
                    }
                });
    }
}


#[derive(Deserialize, Clone, Debug)]
pub enum EventType {
    #[serde(rename = "auth")]
    Auth,
    #[serde(rename = "subscribed")]
    Sub,
}


#[derive(Deserialize, Debug)]
pub struct AuthData {
    pub status: String,
}

#[derive(Deserialize, Debug)]
pub struct SubData {
    pub channel: String,
    pub symbol: Option<String>,
    pub pair: Option<String>,
    pub key: Option<String>,
}

#[derive(Debug)]
pub enum RespData {
    Auth(AuthData),
    Sub(SubData),
}

#[derive(Debug)]
pub struct Resp {
    pub chan_id: i32,
    pub data: RespData,
}

use common::serde::de::Error;
*/

pub fn nonce() -> u64 {
    return ::common::unixtime_millis() as u64;
}

#[derive(Debug, Deserialize, Serialize)]
pub enum InfoTag { #[serde(rename = "info")]    _Info }


#[derive(Debug, Deserialize, Serialize)]
pub enum SubscribedTag { #[serde(rename = "subscribed")]    _Subscribed }

#[derive(Debug, Deserialize, Serialize)]
pub enum HeartbeatTag { #[serde(rename = "hb")]    _Hb }

#[derive(Debug, Deserialize, Serialize)]
pub struct ServerInfo {
    event: InfoTag,
    version: usize,
    #[serde(rename = "serverId")]
    id: String,
    platform: json::Value,
}

#[derive(Debug, Deserialize)]
pub struct Subscribed {
    pub event: SubscribedTag,
    pub channel: String,
    #[serde(rename = "chanId")]
    pub channel_id: usize,
    pub key: String,
}

#[derive(Debug, Deserialize)]
pub struct GeneralInfo {
    pub event : InfoTag,
    pub code : usize,
    pub msg : String
}

#[derive(Debug, Deserialize)]
#[serde(untagged)]
pub enum Message {
    ServerInfo(ServerInfo),
    Subscribed(Subscribed),
    ChannelHeartbeat(usize, HeartbeatTag),
    ChannelData(usize, json::Value),
    General(GeneralInfo),
    Unknown(json::Value),
}

impl TryFrom<WsMessage> for Message {
    type Error = failure::Error;

    fn try_from(value: WsMessage) -> Result<Self, Self::Error> {
        match value {
            WsMessage::Text(text) => {
                Ok(json::from_str(&text)?)
            }
            other => {
                bail!("Invalid message type")
            }
        }
    }
}

/*
impl<'de> Deserialize<'de> for Resp {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error> where
        D: Deserializer<'de> {
        let mut data: json::Value = json::Value::deserialize(deserializer)?;

        #[derive(Deserialize, Debug)]
        struct Help {
            event: EventType,
            #[serde(rename = "chanId")]
            pub chan_id: i32,
        }

        let mut h: Help = json::from_value(data.clone()).map_err(|_| D::Error::custom("ABC"))?;

        match h.event {
            EventType::Auth => {
                return Ok(Resp {
                    chan_id: h.chan_id,
                    data: RespData::Auth(json::from_value::<AuthData>(data).map_err(|e| D::Error::custom("ABC"))?),
                });
            }
            EventType::Sub => {
                debug!("Sub: {:?}", h);
                return Ok(Resp {
                    chan_id: h.chan_id,
                    data: RespData::Sub(json::from_value::<SubData>(data).map_err(|e| D::Error::custom("ABC"))?),
                });
            }
        }
    }
}
*/