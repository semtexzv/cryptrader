use crate::prelude::*;
use crate::schema::{self, ohlc, Pair};

#[cfg(feature = "scylla")]
use cdrs::{
    frame::IntoBytes,
    types::prelude::{Value, TryFromRow},
};

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

impl crate::Database {
    pub fn pairs(&self) -> BoxFuture<Vec<Pair>> {
        return box self.invoke::<_, _, _>(move |this, ctx| {
            let conn: &ConnType = &this.0.get().unwrap();
            use crate::schema::pairs::dsl::*;

            let p = pairs.get_results::<Pair>(conn)?;
            Ok(p)
        });
    }

    pub fn last_ohlc_values(&self) -> BoxFuture<BTreeMap<PairId, common::types::Ohlc>> {
        self.invoke(move |this, ctx| {
            let conn: &ConnType = &this.0.get().unwrap();
            use crate::schema::ohlc::{self, *};

            let sql = ::diesel::sql_query(include_str!("../sql/ohlc_last_values.sql"));

            let vals: Vec<schema::Ohlc> = sql.get_results::<schema::Ohlc>(conn)?;

            Ok(vals.into_iter().map(|it| {
                let tp = TradePair::from_str(it.pair.as_str()).unwrap();
                let id = PairId::new(it.exchange.clone(), tp);
                (id, it.into())
            }).collect())
        })
    }

    pub fn do_save_ohlc(&self, id: PairId, ohlc: Vec<Ohlc>) -> BoxFuture<(), ()> {
        // self.1.save(id.clone(),ohlc.clone());
        self.invoke::<_, _, ()>(move |this, ctx| {
            let (_, t) = measure_time(|| {
                use crate::schema::ohlc::{self, *};

                let conn: &ConnType = &this.0.get().unwrap();

                let new_ohlc: Vec<schema::Ohlc> = ohlc.iter().map(|candle| {
                    schema::Ohlc {
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
            });

            debug!("Saved {} items, took {:?} ", ohlc.len(), t);
            Ok(())
        })
    }

    pub fn ohlc_history(&self, pair_id: PairId, since: i64) -> BoxFuture<BTreeMap<i64, Ohlc>> {
        return box self.invoke::<_, _, diesel::result::Error>(move |this, ctx| {
            use crate::schema::ohlc::*;

            let conn: &ConnType = &this.0.get().unwrap();

            let min_time = since as i64;

            let q = schema::ohlc::table
                .filter(schema::ohlc::time.ge(min_time))
                .filter(schema::ohlc::exchange.eq(exchange))
                .filter(schema::ohlc::pair.eq(pair_id.pair().to_string()))
                .order(schema::ohlc::time.asc());

            let vals: BTreeMap<i64, Ohlc> = q.load::<schema::Ohlc>(conn).expect("Could not query DB")
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

    pub fn ohlc_history_backfilled(&self, spec: OhlcSpec, since: i64) -> BoxFuture<Vec<Ohlc>> {
        return box self.invoke::<_, _, _>(move |this, ctx| {
            let sql = ::diesel::sql_query(include_str!("../sql/ohlc_raw.sql"));

            use crate::schema::ohlc::*;

            let conn: &ConnType = &this.0.get().unwrap();

            let min_time = since as i64;

            let (vals, t): (Vec<Ohlc>, _) = measure_time(|| {
                sql.bind::<Text, _>(&spec.exch())
                    .bind::<Text, _>(&spec.pair().to_string())
                    .bind::<BigInt, _>(spec.period().seconds() as i64)
                    .bind::<BigInt, _>(since as i64)
                    .load::<LoadOhlc>(conn).expect("Could not query db")
                    .iter()
                    .map(|c| c.clone().into()).collect()
            });

            let (vals, t2): (Vec<Ohlc>, _) = measure_time(|| {
                debug!("Raw data :{:?}", vals.len());
                let vals = Ohlc::rescale(vals.into_iter(), spec.period());
                debug!("Rescaled data :{:?}", vals.len());
                let vals = Ohlc::backfill(vals.into_iter(), spec.period());
                vals
            });

            info!("OHLC Load: {:?} ms, rescale: {:?} ,ms , retrieved {:?} items", t, t2, vals.len());
            Ok(vals)
        });
    }
}

