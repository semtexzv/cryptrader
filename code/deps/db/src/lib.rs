#![feature(box_syntax)]
#![allow(unused_imports, unused_variables)]

#[macro_use]
extern crate common;
extern crate time;
#[macro_use]
pub extern crate diesel;
#[macro_use]
pub extern crate diesel_migrations;
pub extern crate r2d2;
pub extern crate r2d2_diesel;

use diesel_migrations::*;
embed_migrations!("./migrations");

mod prelude;
mod schema;
mod ohlc;
mod users;
mod strategies;

use crate::prelude::*;

pub use crate::schema::*;
pub use crate::ohlc::*;
pub use crate::users::*;
pub use crate::strategies::*;

fn db_url() -> String {
    format!("postgres://{}:{}@postgres.default.svc:5432/{}", "trader", "trader", "trader")
}

pub fn init_store() {
    info!("Initializing database");
    let url = db_url();
    let connection = ConnType::establish(&url)
        .expect("Error connecting to DB");

    embedded_migrations::run(&connection).unwrap();
    info!("Migrations performed");
}


pub type ConnType = diesel::PgConnection;
pub type PoolType = diesel::r2d2::Pool<r2d2_diesel::ConnectionManager<diesel::PgConnection>>;


pub struct DbWorker(pub PoolType);

pub fn start() -> Database {
    init_store();
    let url = db_url();

    let manager = r2d2_diesel::ConnectionManager::new(url);
    let pool = diesel::r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create connection pool");

    return Database(SyncArbiter::start(3, move || DbWorker(pool.clone())));
}

impl Actor for DbWorker {
    type Context = SyncContext<Self>;
}

pub struct Invoke<F, R, E> (pub F)
    where F: FnOnce(&mut DbWorker, &mut <DbWorker as Actor>::Context) -> Result<R, E> + Send + 'static,
          R: Send + 'static,
          E: Send + 'static;

impl<F, R, E> Message for Invoke<F, R, E>
    where F: FnOnce(&mut DbWorker, &mut <DbWorker as Actor>::Context) -> Result<R, E> + Send + 'static,
          R: Send + 'static,
          E: Send + 'static {
    type Result = Result<R, E>;
}

impl<F, R, E> Handler<Invoke<F, R, E>> for DbWorker
    where F: FnOnce(&mut DbWorker, &mut <DbWorker as Actor>::Context) -> Result<R, E> + Send + 'static,
          R: Send + 'static,
          E: Send + 'static {
    type Result = Result<R, E>;

    fn handle(&mut self, msg: Invoke<F, R, E>, ctx: &mut Self::Context) -> Self::Result {
        return msg.0(self, ctx);
    }
}

#[derive(Clone)]
pub struct Database(Addr<DbWorker>);

impl Database {
    pub fn invoke<F, R, E>(&self, f: F) -> BoxFuture<R, E>
        where F: FnOnce(&mut DbWorker, &mut <DbWorker as Actor>::Context) -> Result<R, E> + Send + 'static,
              R: Send + 'static,
              E: Send + 'static + Debug
    {
        let req = self.0.send(Invoke(f));
        let req: BoxFuture<R, E> = box req.then(|r| r.unwrap());
        req
    }

    pub fn do_invoke<F, R, E>(&self, f: F)
        where F: FnOnce(&mut DbWorker, &mut <DbWorker as Actor>::Context) -> Result<R, E> + Send + 'static,
              R: Send + 'static,
              E: Send + 'static + Debug
    {
        self.0.do_send(Invoke(f));
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


/*

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
        .bind::<BigInt, _>(min_db_time() as i64)
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
*/