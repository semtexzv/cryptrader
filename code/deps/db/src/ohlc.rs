use crate::prelude::*;
use crate::schema::{self, ohlc, Pair};
use common::types::Exchange;
use diesel::select;


#[derive(PartialEq, Debug, Clone, Queryable, QueryableByName)]
#[table_name = "ohlc"]
pub struct LoadOhlc {
    pub time: i64,
    pub pair_id: i32,
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
    pub pair_id: i32,
    pub time: i64,
}


const LAST_Q: &'static str = r##"
with bound_vals as (
    select pair_id, max(time) as time
    from ohlc
    group by pair_id
)
select * from ohlc join bound_vals
                        on ohlc.pair_id = bound_vals.pair_id and ohlc.time = bound_vals.time
"##;

const FIRST_Q: &'static str = r##"
with bound_vals as (
    select pair_id, min(time) as time
    from ohlc
    group by pair_id
)
select * from ohlc join bound_vals
                        on ohlc.pair_id = bound_vals.pair_id and ohlc.time = bound_vals.time
"##;


impl crate::Database {
    pub fn pair_id(&self, pair_id: PairId) -> LocalBoxFuture<'static, Result<i32>> {
        self.0.invoke(move |this, ctx| {
            Ok(select(schema::pair_id(pair_id.exch().to_string(), pair_id.pair().to_string()))
                .load(&this.conn())?[0]
            )
        })
    }
    pub fn pair_data(&self, pair_id: i32) -> LocalBoxFuture<'static, Result<PairId>> {
        self.0.invoke(move |this, ctx| {
            let p : Pair = Pair::identified_by(&pair_id).get_result(&this.conn())?;
            let p : PairId = p.into();
            Ok(p)
        })
    }
    pub async fn pairs(&self) -> Result<Vec<Pair>> {
        self.0.invoke(move |this, ctx| {
            Pair::get_all().load(&this.conn())
        }).await
    }

    async fn ohlcs_from_query(&self, query: &'static str) -> Result<BTreeMap<PairId, common::types::Ohlc>> {
        let pairs = self.pairs().await?;
        self.0.invoke(move |this, ctx| {
            let ohlcs: Vec<schema::Ohlc> = diesel::dsl::sql_query(query).load(&this.conn())?;
            pairs.into_iter()
                .map(|p| {
                    let v = ohlcs.iter().find(|o| o.pair_id == p.id).map(Clone::clone)
                        .ok_or(diesel::result::Error::NotFound);
                    (p, v)
                })
                .map(|(k, v)| Ok((k.into(), v?.into())))
                .collect::<Result<BTreeMap<PairId, _>>>()
        }).await
    }

    pub async fn ohlc_lasts(&self) -> Result<BTreeMap<PairId, common::types::Ohlc>> {
        self.ohlcs_from_query(LAST_Q).await
    }
    pub async fn ohlc_firsts(&self) -> Result<BTreeMap<PairId, common::types::Ohlc>> {
        self.ohlcs_from_query(FIRST_Q).await
    }

    pub fn do_save_ohlc(&self, id: PairId, ohlc: Vec<Ohlc>) -> LocalBoxFuture<'static, Result<()>> {
        self.0.invoke(move |this, ctx| {
            let (len, t) = measure_time::<Result<usize>, _>(|| {
                let conn: ConnType = this.conn();

                let pair_id: i32 = diesel::select(schema::make_pair_id(id.exchange().to_string(), id.pair().to_string()))
                    .get_result(&conn)?;

                let mapped = ohlc.into_iter().map(|i| schema::Ohlc::new(pair_id, i)).collect::<Vec<_>>();
                Ok(mapped.chunks(4096).map(|chunk| {
                    use diesel::pg::upsert::*;
                    use crate::schema::ohlc::*;

                    let stmt = ::diesel::insert_into(schema::ohlc::table)
                        .values(chunk)
                        .on_conflict((ohlc::pair_id, ohlc::time))
                        .do_update()
                        .set((open.eq(excluded(open)),
                              high.eq(excluded(high)),
                              low.eq(excluded(low)),
                              close.eq(excluded(close)),
                              vol.eq(excluded(vol))
                        ));

                    stmt.execute(&conn)
                }).collect::<Result<Vec<usize>>>()?.into_iter().sum())
            });
            warn!("Saved {:?} items, took {:?} ", len, t);
            Ok(())
        }).boxed_local()
    }

    pub fn ohlc_history(&self, pid: PairId, since: i64) -> LocalBoxFuture<'static, Result<BTreeMap<i64, Ohlc>>> {
        self.0.invoke(move |this, ctx| {
            use crate::schema::ohlc::*;

            let conn: &ConnType = &this.pool.get().unwrap();

            let min_time = since as i64;
            let exch_val = pid.exchange().to_string();
            let pair_val = pid.pair().to_string();

            let q = schema::ohlc::table
                .filter(schema::ohlc::time.ge(min_time))
                .filter(schema::ohlc::pair_id.eq(schema::pair_id(exch_val, pair_val)))
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
        })
    }

    pub fn ohlc_history_backfilled(&self, pair_id: i32, period: OhlcPeriod, since: i64) -> LocalBoxFuture<'static, Result<Vec<Ohlc>>> {
        self.0.invoke(move |this, ctx| {
            use crate::schema::ohlc::dsl::*;

            let min_time = since as i64;

            let (vals, t): (Vec<Ohlc>, _) = measure_time(|| {
                ohlc.filter(time.gt(since as i64))
                    .order_by(time.asc())
                    .load::<LoadOhlc>(&this.conn()).expect("Could not query db")
                    .iter()
                    .map(|c| c.clone().into()).collect()
            });

            let (vals, t2): (Vec<Ohlc>, _) = measure_time(|| {
                debug!("Raw data :{:?}", vals.len());
                let vals = Ohlc::rescale(vals.into_iter(), period);
                debug!("Rescaled data :{:?}", vals.len());
                let vals = Ohlc::backfill(vals.into_iter(), period);
                vals
            });

            info!("OHLC Load: {:?} ms, rescale: {:?} ,ms , retrieved {:?} items", t, t2, vals.len());
            Ok(vals)
        })
    }
}

