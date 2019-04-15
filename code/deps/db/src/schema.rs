use super::*;
use ::std::result::Result as Result;
use uuid::Uuid;

table! {
    assignments (exchange, pair, owner_id) {
        exchange -> Text,
        pair -> Text,
        owner_id -> Int4,
        period -> Text,
        strategy_id -> Int4,
        trader_id -> Nullable<Int4>,
    }
}

table! {
    evaluations (strategy_id, exchange, pair, owner_id, period, time) {
        strategy_id -> Int4,
        exchange -> Text,
        pair -> Text,
        period -> Text,
        owner_id -> Int4,
        time -> Timestamptz,
        status -> Bool,
        ok -> Nullable<Text>,
        error -> Nullable<Text>,
        duration -> Int8,
    }
}

table! {
    ohlc (pair, exchange, time) {
        time -> Int8,
        exchange -> Varchar,
        pair -> Varchar,
        open -> Float8,
        high -> Float8,
        low -> Float8,
        close -> Float8,
        vol -> Float8,
    }
}

table! {
    ohlc_rollups (pair, exchange, period, time) {
        time -> Int8,
        exchange -> Varchar,
        pair -> Varchar,
        open -> Float8,
        high -> Float8,
        low -> Float8,
        close -> Float8,
        vol -> Float8,
        period -> Int8,
    }
}

table! {
    strategies (id) {
        id -> Int4,
        owner_id -> Int4,
        name -> Text,
        body -> Text,
        created -> Timestamptz,
        updated -> Timestamptz,
    }
}

table! {
    traders (id) {
        id -> Int4,
        user_id -> Int4,
        name -> Text,
        exchange -> Text,
        api_key -> Text,
        api_secret -> Text,
    }
}

table! {
    trades (uuid) {
        uuid -> Uuid,
        time -> Timestamptz,
        trader_id -> Int4,
        exchange -> Varchar,
        pair -> Varchar,
        period -> Varchar,
        buy -> Bool,
        amount -> Float8,
        price -> Float8,
        status -> Bool,
        ok -> Nullable<Text>,
        error -> Nullable<Text>,
    }
}

table! {
    users (id) {
        id -> Int4,
        name -> Nullable<Text>,
        email -> Text,
        password -> Text,
        avatar -> Nullable<Text>,
        is_verified -> Bool,
        has_verified_email -> Bool,
        created -> Timestamptz,
        updated -> Timestamptz,
    }
}

joinable!(assignments -> strategies (strategy_id));
joinable!(assignments -> traders (trader_id));
joinable!(assignments -> users (owner_id));
joinable!(evaluations -> strategies (strategy_id));
joinable!(strategies -> users (owner_id));
joinable!(traders -> users (user_id));
joinable!(trades -> traders (trader_id));

allow_tables_to_appear_in_same_query!(
    assignments,
    evaluations,
    ohlc,
    ohlc_rollups,
    strategies,
    traders,
    trades,
    users,
);


#[derive(PartialEq, Deserialize, Serialize, Debug, Clone)]
#[derive(Queryable, Insertable, AsChangeset, Associations, QueryableByName)]
#[table_name = "users"]
pub struct User {
    pub id: i32,
    pub name: Option<String>,
    pub email: String,
    pub password: String,
    pub avatar: Option<String>,
    pub is_verified: bool,
    pub has_verified_email: bool,
    pub created: chrono::NaiveDateTime,
    pub updated: chrono::NaiveDateTime,
}

#[derive(PartialEq, Deserialize, Serialize, Debug, Clone)]
#[derive(Queryable, Insertable, AsChangeset, Associations, QueryableByName)]
#[table_name = "traders"]
pub struct Trader {
    pub id: i32,
    pub user_id: i32,
    pub name: String,

    pub exchange: String,
    pub api_key: String,
    pub api_secret: String,
}

#[derive(PartialEq, Deserialize, Serialize, Debug, Clone)]
#[derive(Queryable, Insertable, AsChangeset, Associations, QueryableByName)]
#[table_name = "ohlc"]
pub struct Ohlc {
    pub time: i64,
    pub exchange: String,
    pub pair: String,
    pub open: f64,
    pub high: f64,
    pub low: f64,
    pub close: f64,
    pub vol: f64,
}

impl Into<common::types::Ohlc> for Ohlc {
    fn into(self) -> common::types::Ohlc {
        return common::types::Ohlc {
            time: self.time as _,
            open: self.open,
            high: self.high,
            low: self.low,
            close: self.close,
            vol: self.vol,
        };
    }
}


#[derive(PartialEq, Deserialize, Serialize, Debug, Clone)]
#[derive(Queryable, Insertable, AsChangeset, Associations, QueryableByName)]
#[table_name = "strategies"]
pub struct Strategy {
    pub id: i32,
    pub owner_id: i32,
    pub name: String,
    pub body: String,
    pub created: chrono::NaiveDateTime,
    pub updated: chrono::NaiveDateTime,
}


#[derive(PartialEq, Deserialize, Serialize, Debug, Clone)]
#[derive(Queryable, Insertable, AsChangeset, Associations, QueryableByName)]
#[table_name = "assignments"]
pub struct Assignment {
    pub exchange: String,
    pub pair: String,
    pub owner_id: i32,
    pub period: String,
    pub strategy_id: i32,

    pub trader_id: Option<i32>,
}


#[derive(PartialEq, Deserialize, Serialize, Debug, Clone)]
#[derive(Queryable, Insertable, AsChangeset, Associations, QueryableByName)]
#[table_name = "evaluations"]
pub struct Evaluation {
    pub strategy_id: i32,
    pub exchange: String,
    pub pair: String,
    pub period: String,
    pub owner_id: i32,

    pub time: chrono::NaiveDateTime,
    pub status: bool,
    pub ok: Option<String>,
    pub error: Option<String>,

    pub duration : i64,
}


#[derive(PartialEq, Deserialize, Serialize, Debug, Clone)]
#[derive(Queryable, Insertable, AsChangeset, Associations, QueryableByName)]
#[table_name = "trades"]
pub struct Trade {
    pub uuid: Uuid,
    pub time: chrono::NaiveDateTime,

    pub trader_id: i32,
    pub exchange: String,
    pub pair: String,
    pub period: String,

    pub buy: bool,
    pub amount: f64,
    pub price: f64,

    pub status: bool,
    pub ok: Option<String>,
    pub error: Option<String>,
}



// This is a table resulting from materialized view
table! {
    pairs(exchange, pair) {
        exchange -> Text,
        pair -> Text,
    }
}

#[derive(PartialEq, Deserialize, Serialize, Debug, Clone)]
#[derive(Queryable, Associations, QueryableByName)]
#[table_name = "pairs"]
pub struct Pair {
    pub exchange: String,
    pub pair: String,
}


