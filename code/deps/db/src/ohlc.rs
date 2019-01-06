use common::prelude::*;
use diesel::prelude::*;

use crate::{
    Database,
    ConnType,
    schema::{
        self,
        ohlc::{
            self, *,
        },
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

impl Handler<SaveOhlc> for Database {
    type Result = ();

    fn handle(&mut self, msg: SaveOhlc, ctx: &mut Self::Context) {
        let SaveOhlc { id, ohlc } = msg;
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
        println!("Saved {} items", new_ohlc.len());
    }
}

pub struct OhlcCounts {
}
impl Message for OhlcCounts {
    type Result = HashMap<PairId,usize>;
}