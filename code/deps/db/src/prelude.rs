pub use std::env;
pub use common::{
    prelude::*,
    time::PreciseTime,
    types::{
        TradePair, PairId, OhlcSpec, OhlcPeriod, Ohlc,
    },
};

pub use diesel::prelude::*;
pub(crate) use diesel::sql_types::{Text, BigInt};


pub(crate) use crate::{DbWorker, ConnType, schema};

pub use schema::{User, Strategy, Assignment, Evaluation, Trader};

pub(crate) type BoxFuture<I, E = diesel::result::Error> = Box<Future<Item=I, Error=E>>;

/*
mod my_date_format {
    use crate::chrono::{DateTime, Utc, TimeZone};
    use crate::serde::{self, Deserialize, Serializer, Deserializer};

    const FORMAT: &'static str = "%Y-%m-%d %H:%M:%S";

    // The signature of a serialize_with function must follow the pattern:
    //
    //    fn serialize<S>(&T, S) -> Result<S::Ok, S::Error>
    //    where
    //        S: Serializer
    //
    // although it may also be generic over the input types T.
    pub fn serialize<S>(
        date: &DateTime<Utc>,
        serializer: S,
    ) -> Result<S::Ok, S::Error>
        where
            S: Serializer,
    {
        let s = format!("{}", date.format(FORMAT));
        serializer.serialize_str(&s)
    }

    pub fn time_to_json(t: NaiveDateTime) -> String {
        DateTime::<Utc>::from_utc(t, Utc).to_rfc3339()
    }

    pub fn serialize<S: Serializer>(time: &NaiveDateTime, serializer: S) -> Result<S::Ok, S::Error> {
        time_to_json(time.clone()).serialize(serializer)
    }

    // The signature of a deserialize_with function must follow the pattern:
    //
    //    fn deserialize<'de, D>(D) -> Result<T, D::Error>
    //    where
    //        D: Deserializer<'de>
    //
    // although it may also be generic over the output types T.
    pub fn deserialize<'de, D>(
        deserializer: D,
    ) -> Result<DateTime<Utc>, D::Error>
        where
            D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        Utc.datetime_from_str(&s, FORMAT).map_err(serde::de::Error::custom)
    }
}
*/