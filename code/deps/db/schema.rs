table! {
    assignments (pair_id, user_id) {
        pair_id -> Int4,
        user_id -> Int4,
        period -> Text,
        strategy_id -> Int4,
        trader_id -> Nullable<Int4>,
    }
}

table! {
    evaluations (id) {
        id -> Uuid,
        pair_id -> Int4,
        period -> Text,
        user_id -> Int4,
        strategy_id -> Int4,
        time -> Timestamptz,
        status -> Bool,
        duration -> Int8,
        ok -> Nullable<Text>,
        error -> Nullable<Text>,
    }
}

table! {
    ohlc (pair_id, time) {
        time -> Int8,
        pair_id -> Int4,
        open -> Float8,
        high -> Float8,
        low -> Float8,
        close -> Float8,
        vol -> Float8,
    }
}

table! {
    pairs (id) {
        id -> Int4,
        exchange -> Varchar,
        pair -> Varchar,
    }
}

table! {
    strategies (id) {
        id -> Int4,
        user_id -> Int4,
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
    trades (id) {
        id -> Uuid,
        time -> Timestamptz,
        user_id -> Int4,
        trader_id -> Int4,
        pair_id -> Int4,
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

joinable!(assignments -> pairs (pair_id));
joinable!(assignments -> strategies (strategy_id));
joinable!(assignments -> traders (trader_id));
joinable!(assignments -> users (user_id));
joinable!(evaluations -> pairs (pair_id));
joinable!(evaluations -> strategies (strategy_id));
joinable!(evaluations -> users (user_id));
joinable!(ohlc -> pairs (pair_id));
joinable!(strategies -> users (user_id));
joinable!(traders -> users (user_id));
joinable!(trades -> pairs (pair_id));
joinable!(trades -> traders (trader_id));
joinable!(trades -> users (user_id));

allow_tables_to_appear_in_same_query!(
    assignments,
    evaluations,
    ohlc,
    pairs,
    strategies,
    traders,
    trades,
    users,
);
