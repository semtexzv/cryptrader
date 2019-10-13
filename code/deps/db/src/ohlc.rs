use crate::prelude::*;
use crate::schema::{self, ohlc, Pair};
use common::types::Exchange;


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
    pub async fn pairs(&self) -> Result<Vec<Pair>> {
        self.0.invoke(move |this| {
            Pair::get_all().load(&this.conn())
        }).await
    }

    async fn ohlcs_from_query(&self, query: &'static str) -> Result<BTreeMap<PairId, common::types::Ohlc>> {
        let pairs = self.pairs().await?;
        self.0.invoke(move |this| {
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
        self.0.invoke(move |this| {
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
        })
    }

    pub async fn ohlc_history(&self, pid: PairId, since: i64) -> Result<BTreeMap<i64, Ohlc>> {
        ActorExt::invoke(self.0.clone(), move |this| {
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
        }).await
    }

    pub fn ohlc_history_backfilled(&self, spec: OhlcSpec, since: i64)
                                   -> impl Future<Output=Result<Vec<Ohlc>>> + 'static {
        self.0.invoke(move |this| {
            let sql = ::diesel::sql_query(include_str!("../sql/ohlc_raw.sql"));

            use crate::schema::ohlc::*;

            let conn: &ConnType = &this.pool.get().unwrap();

            let min_time = since as i64;

            let (vals, t): (Vec<Ohlc>, _) = measure_time(|| {
                sql.bind::<Text, _>(&spec.exch().to_string())
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
        })
    }
}

