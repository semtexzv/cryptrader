use cdrs::{
    query_values,
    authenticators::PasswordAuthenticator,
    cluster::{
        session::{
            Session,
            new as new_session,
        }
    },
    cluster::{TcpConnectionPool, ClusterTcpConfig, NodeTcpConfigBuilder},
    load_balancing::{Random, RoundRobin},
    query::*,
    frame::IntoBytes,
    types::from_cdrs::FromCDRSByName,
    types::prelude::*,
};


use common::types::{PairId, Ohlc};


static CREATE_KEYSPACE: &str = include_str!("../cql/keyspace.cql");
static CREATE_TABLE: &str = include_str!("../cql/ohlc_table.cql");

static INSERT_OHLC: &str = include_str!("../cql/insert_ohlc.cql");


pub struct CsDb(Session<RoundRobin<TcpConnectionPool<PasswordAuthenticator<'static>>>>);

pub fn connect() -> CsDb {
    println!("Connecting to scylla");
    let node = NodeTcpConfigBuilder::new("scylla-1.scylla.default.svc:9042", PasswordAuthenticator::new("cassandra", "cassandra")).build();
    let cluster_config = ClusterTcpConfig(vec![node]);
    let session = new_session(&cluster_config, RoundRobin::new()).expect("session should be created");

    session.query(CREATE_KEYSPACE).expect("Keyspace create error");
    println!("Keyspace created");
    session.query(CREATE_TABLE).expect("Create ohlc table error");
    println!("Table created");

    return CsDb(session);
}


use cdrs_helpers_derive::{IntoCDRSValue, TryFromRow};
use common::prelude::PreciseTime;


#[derive(Clone, Debug, IntoCDRSValue, TryFromRow, PartialEq)]
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

impl CsDb {
    pub fn save(&self, id: PairId, ohlc: Vec<Ohlc>) {
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

        let q = self.0.prepare(INSERT_OHLC).expect("Prepare query");

        let mut queries = BatchQueryBuilder::new();

        for o in new_ohlc.into_iter() {
            let values = query_values!(o.time,o.exchange,o.pair,o.open,o.high,o.low,o.close,o.vol);
            queries = queries.add_query_prepared(q.clone(), values);
        }
        self.0.batch_with_params(queries.finalize().expect("Finalized"))
            .expect("Batched write");

        let t2 = PreciseTime::now();
        println!("Saved csdb items, took {:?} ", t1.to(t2).num_milliseconds());
    }
}