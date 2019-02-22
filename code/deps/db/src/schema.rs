use super::*;
use ::std::result::Result as Result;
table! {
    cached_ohlc (pair, exchange, period, time) {
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
    eval_requests (strategy_id, exchange, pair, period) {
        strategy_id -> Int4,
        exchange -> Text,
        pair -> Text,
        period -> Text,
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
    strategies (id) {
        id -> Int4,
        owner -> Int4,
        body -> Text,
        created -> Timestamptz,
        updated -> Timestamptz,
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

joinable!(eval_requests -> strategies (strategy_id));
joinable!(strategies -> users (owner));

allow_tables_to_appear_in_same_query!(
    cached_ohlc,
    eval_requests,
    ohlc,
    strategies,
    users,
);
