#![allow(unused_imports)]

#[macro_use]
extern crate common;
#[macro_use]
pub extern crate diesel;
#[macro_use]
pub extern crate diesel_derives;


extern crate time;

use common::*;
use common::types::{
    spec::{TradePair, PairId, OhlcSpec},
    ohlc::{OhlcPeriod, Ohlc},
};

use diesel::prelude::*;
use std::env;

mod schema {
    use super::*;
    //infer_schema!("dotenv:DATABASE_URL");

    table! {
        ohlc (time, exchange, pair) {
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

    use ::std::result::Result as Result;

    #[derive(PartialEq, Debug, Clone, Queryable, Insertable, AsChangeset, Associations, QueryableByName)]
    #[table_name = "ohlc"]
    pub struct DbOhlc {
        pub time: i64,
        pub exchange: String,
        pub pair: String,
        pub open: f64,
        pub high: f64,
        pub low: f64,
        pub close: f64,
        pub vol: f64,
    }

    #[derive(PartialEq, Debug, Clone, Queryable, QueryableByName)]
    #[table_name = "ohlc"]
    pub struct LoadOhlc {
        pub time: i64,
        pub open: f64,
        pub high: f64,
        pub low: f64,
        pub close: f64,
        pub vol: f64,
    }


    impl Into<Ohlc> for LoadOhlc {
        fn into(self) -> Ohlc {
            return Ohlc {
                time: self.time as _,
                open: self.open,
                high: self.high,
                low: self.low,
                close: self.close,
                vol: self.vol,
            };
        }
    }


    #[derive(PartialEq, Debug, Clone, Queryable, QueryableByName)]
    #[table_name = "ohlc"]
    pub struct OhlcTime {
        pub exchange: String,
        pub pair: String,
        pub time: i64,
    }
}


pub fn connect_store() -> ConnType {
    //dotenv().ok();

    let url = env::var("DATABASE_URL")
        .unwrap_or("postgres://postgres:postgres@ec2-18-196-86-128.eu-central-1.compute.amazonaws.com:5433/cryptrader".into());

    ConnType::establish(&url)
        .expect("Error connecting to DB")
}

use self::schema::DbOhlc;
use self::schema::LoadOhlc;
use diesel::sql_types::{Integer, Text, BigInt};


pub type ConnType = diesel::PgConnection;

pub fn save_ohlc(conn: &ConnType, id: &PairId, ohlc: &[Ohlc]) {
    let new_ohlc: Vec<DbOhlc> = ohlc.iter().map(|candle| {
        DbOhlc {
            time: candle.time as i64,
            exchange: id.exchange().into(),
            pair: id.pair().to_string(),
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
            vol: candle.vol,
        }
    }).collect();

    let t1 = PreciseTime::now();
    for data in new_ohlc.chunks(4096) {
        use diesel::pg::upsert::*;
        use schema::ohlc;
        use schema::ohlc::*;

        let stmt = ::diesel::insert_into(schema::ohlc::table)
            .values(data)
            .on_conflict((ohlc::time, ohlc::pair, ohlc::exchange))
            .do_update()
            .set(
                (open.eq(excluded(open)),
                 high.eq(excluded(high)),
                 low.eq(excluded(low)),
                 close.eq(excluded(close)),
                 vol.eq(excluded(vol))
                ));


        stmt.execute(conn)
            .expect("Error saving candle into the database");
    }
    let t2 = PreciseTime::now();

    info!("Saving {} items took {} ms", new_ohlc.len(), t1.to(t2).num_milliseconds());
}

pub fn last_6hours_ohlc(conn: &ConnType, exchange: &str, pair: &TradePair) -> BTreeMap<u64, Ohlc> {
    use self::schema::*;

    let min_time = unixtime() - 60 * 60 * 6;

    let q = schema::ohlc::table
        .filter(schema::ohlc::time.ge(min_time))
        .filter(schema::ohlc::exchange.eq(exchange))
        .filter(schema::ohlc::pair.eq(pair.to_string()))
        .order(schema::ohlc::time.asc());

    let vals: BTreeMap<u64, Ohlc> = q.load::<DbOhlc>(conn).expect("Could not query DB")
        .iter()
        .map(|c| (c.time as u64, Ohlc {
            time: (c.time) as _,
            open: c.open,
            high: c.high,
            low: c.high,
            close: c.close,
            vol: c.vol,

        })).collect();

    return vals;
}

pub fn last_candle_for(conn: &ConnType, exchange: &str, pair: &TradePair) -> Option<Ohlc> {
    return last_ohlc(conn, &PairId::new(exchange, pair.clone()));
}

pub fn last_ohlc(conn: &ConnType, id: &PairId) -> Option<Ohlc> {
    use self::schema::*;

    let now = unixtime();

    let q = schema::ohlc::table
        .filter(schema::ohlc::pair.eq(id.pair().to_string()))
        .filter(schema::ohlc::exchange.eq(id.exchange()))
        .filter(schema::ohlc::time.le(now))
        .filter(schema::ohlc::time.ge(now - days_to_seconds(10) as i64))
        .order(schema::ohlc::time.desc())
        .limit(1);

//    println!("SQL {}", diesel::debug_query::<diesel::pg::Pg,_>(&q));
    let vals: Vec<Ohlc> = q.load::<DbOhlc>(conn).expect("Could not query DB")
        .iter()
        .map(|c| Ohlc {
            time: (c.time) as _,
            open: c.open,
            high: c.high,
            low: c.high,
            close: c.close,
            vol: c.vol,

        }).collect();

    //error!("Last for {:?} returned : {:?}", id, vals);

    return vals.get(0).map(|x| x.clone());
}


pub fn max_ohlc_pair_times(conn: &ConnType, exchange: &'static str) -> Vec<(PairId, u64)> {
    use self::schema::*;
    let sql = ::diesel::sql_query(include_str!("../../../sql/ohlc_last_times.sql"));

    return sql
        .bind::<Text, _>(&exchange.to_string())
        .bind::<BigInt,_>(min_db_time() as i64)
        .load::<OhlcTime>(conn).expect("Could not query db")
        .into_iter()
        .map(|c: OhlcTime| {
            let OhlcTime { exchange, pair, time } = c;
            (PairId::new(exchange, TradePair::from_str(&pair).unwrap()), time as u64)
        }).collect();
}

pub fn resampled_ohlc_values(conn: &ConnType, spec: &OhlcSpec, since: u64) -> Vec<Ohlc> {
    let sql = ::diesel::sql_query(include_str!("../../../sql/ohlc_resampled_tdb.sql"));

    //let since = spec.period().clamp_time(unixtime() as u64 - 400 * spec.period().seconds() as u64);


    let vals: Vec<Ohlc> = sql
        .bind::<Text, _>(&spec.exch())
        .bind::<Text, _>(&spec.pair().to_string())
        .bind::<BigInt, _>(spec.period().seconds() as i64)
        .bind::<BigInt, _>(since as i64)
        .load::<LoadOhlc>(conn).expect("Could not query db")
        .iter()
        .map(|c| c.clone().into()).collect();


    //println!("Execution time : {}", t1.to(t2).num_milliseconds());

    return vals;
}