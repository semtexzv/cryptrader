use common::prelude::*;
use diesel::prelude::*;

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


pub struct SaveOhlc {
    pub id: PairId,
    pub ohlc: Vec<Ohlc>,
}

impl Message for SaveOhlc {
    type Result = ();
}

impl Handler<SaveOhlc> for DbWorker {
    type Result = ();

    fn handle(&mut self, msg: SaveOhlc, ctx: &mut Self::Context) {
        let SaveOhlc { id, ohlc } = msg;
        use self::schema::ohlc::*;

        let conn: &ConnType = &self.0.get().unwrap();

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
    }
}

pub struct OhlcCounts {}

impl Message for OhlcCounts {
    type Result = HashMap<PairId, usize>;
}


#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OhlcHistory {
    pair: PairId,
    since: i64,
}

impl Message for OhlcHistory {
    type Result = Result<BTreeMap<u64, Ohlc>>;
}

impl OhlcHistory {
    pub fn new(pair: PairId, since: i64) -> Self {
        OhlcHistory {
            pair,
            since,
        }
    }
}


impl Handler<OhlcHistory> for DbWorker {
    type Result = Result<BTreeMap<u64, Ohlc>>;

    fn handle(&mut self, msg: OhlcHistory, ctx: &mut Self::Context) -> Self::Result {
        use self::schema::ohlc::*;

        let conn: &ConnType = &self.0.get().unwrap();

        let min_time = msg.since as i64;

        let q = schema::ohlc::table
            .filter(schema::ohlc::time.ge(min_time))
            .filter(schema::ohlc::exchange.eq(exchange))
            .filter(schema::ohlc::pair.eq(msg.pair.pair().to_string()))
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

        return Ok(vals);
    }
}

/*
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

pub struct ResampledOhlc { }
*/