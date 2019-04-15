use cdrs::{
    query_values,
    authenticators::{
        NoneAuthenticator, PasswordAuthenticator,
    },
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

        let q = self.0.prepare(INSERT_OHLC).expect("Prepare queryt");

        for o in new_ohlc.into_iter() {
            self.0.exec_with_values(&q, o).unwrap();
        }
    }
}