use common::prelude::*;
use diesel::prelude::*;
use diesel::sql_types::{Integer, Text, BigInt};

use crate::{
    DbWorker,
    ConnType,
    schema::{
        self,
        ohlc,
        users,
    },
};

use common::{
    types::{
        TradePair, PairId, OhlcSpec, OhlcPeriod, Ohlc,
    },
};

#[table_name = "ohlc"]
#[derive(PartialEq, Debug, Clone, Queryable, Insertable, AsChangeset, Associations, QueryableByName)]
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

#[table_name = "ohlc"]
#[derive(PartialEq, Debug, Clone, Queryable, QueryableByName)]
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

impl crate::Database {
    pub fn do_save_ohlc(&self, id: PairId, ohlc: Vec<Ohlc>) {
        self.do_invoke::<_, _, ()>(move |this, ctx| {
            use crate::schema::ohlc::{self, *};

            let conn: &ConnType = &this.0.get().unwrap();

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

            for data in new_ohlc.chunks(4096) {
                use diesel::pg::upsert::*;

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
            debug!("Saved {} items", new_ohlc.len());
            Ok(())
        })
    }

    pub fn ohlc_history(&self, pair_id: PairId, since: i64) -> BoxFuture<BTreeMap<i64, Ohlc>> {
        return box self.invoke::<_, _, Error>(move |this, ctx| {
            use self::schema::ohlc::*;

            let conn: &ConnType = &this.0.get().unwrap();

            let min_time = since as i64;

            let q = schema::ohlc::table
                .filter(schema::ohlc::time.ge(min_time))
                .filter(schema::ohlc::exchange.eq(exchange))
                .filter(schema::ohlc::pair.eq(pair_id.pair().to_string()))
                .order(schema::ohlc::time.asc());

            let vals: BTreeMap<i64, Ohlc> = q.load::<DbOhlc>(conn).expect("Could not query DB")
                .iter()
                .map(|c| (c.time as _, Ohlc {
                    time: (c.time) as _,
                    open: c.open,
                    high: c.high,
                    low: c.high,
                    close: c.close,
                    vol: c.vol,

                })).collect();

            Ok(vals)
        });
    }

    pub fn resampled_ohlc_values(&self, spec: OhlcSpec, since: i64) -> BoxFuture<Vec<Ohlc>> {
        let sql = ::diesel::sql_query(include_str!("../sql/ohlc_resampled_tdb.sql"));

        //let since = spec.period().clamp_time(unixtime() as u64 - 400 * spec.period().seconds() as u64);

        return box self.invoke::<_, _, Error>(move |this, ctx| {
            let conn: &ConnType = &this.0.get().unwrap();

            let vals: Vec<Ohlc> = sql
                .bind::<Text, _>(&spec.exch())
                .bind::<Text, _>(&spec.pair().to_string())
                .bind::<BigInt, _>(spec.period().seconds() as i64)
                .bind::<BigInt, _>(since as i64)
                .load::<LoadOhlc>(conn).expect("Could not query db")
                .iter()
                .map(|c| c.clone().into()).collect();

            Ok(vals)
        });
    }
}

