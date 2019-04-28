use std::sync::Arc;
use common::prelude::*;
use common::types::{PairId, Ohlc};

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
    load_balancing::{Random, RoundRobin, RoundRobinSync},
    query::*,
    frame::IntoBytes,
    types::{
        prelude::*,
        value::Bytes,
        from_cdrs::FromCDRSByName,
    },
};
use super::impl_invoke;

use cdrs_helpers_derive::{IntoCDRSValue, TryFromRow};
use common::prelude::Instant;

static CREATE_KEYSPACE: &str = include_str!("../../cql/keyspace.cql");
static CREATE_TABLE: &str = include_str!("../../cql/ohlc_table.cql");
static INSERT_OHLC: &str = include_str!("../../cql/insert_ohlc.cql");

type CurrentSession = Session<RoundRobinSync<TcpConnectionPool<PasswordAuthenticator<'static>>>>;

pub struct ScyllaWorker(Arc<CurrentSession>);

impl Actor for ScyllaWorker {
    type Context = SyncContext<Self>;
}

pub fn connect() -> Scylla {
    println!("Connecting to scylla");
    let node = NodeTcpConfigBuilder::new("scylla-1.scylla.default.svc:9042", PasswordAuthenticator::new("cassandra", "cassandra")).build();
    let cluster_config = ClusterTcpConfig(vec![node]);
    let session = new_session(&cluster_config, RoundRobinSync::new()).expect("session should be created");

    session.query(CREATE_KEYSPACE).expect("Keyspace create error");
    println!("Keyspace created");
    session.query(CREATE_TABLE).expect("Create ohlc table error");
    println!("Table created");
    let sess = Arc::new(session);
    return Scylla(SyncArbiter::start(4, move || ScyllaWorker(sess.clone())));
}

#[derive(Clone)]
pub struct Scylla(Addr<ScyllaWorker>);

impl_invoke!(Scylla,ScyllaWorker);

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

impl Scylla {
    pub fn save(&self, id: PairId, ohlc: Vec<Ohlc>) {
        return self.do_invoke::<_, _, failure::Error>(move |this, ctx| {
            let (_,t) = measure_time(|| {
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
                let t1 = Instant::now();

                let q = this.0.prepare(INSERT_OHLC).expect("Prepare query");

                let mut queries = BatchQueryBuilder::new();

                for o in new_ohlc.into_iter() {
                    let values = query_values!(o.time,o.exchange,o.pair,o.open,o.high,o.low,o.close,o.vol);
                    queries = queries.add_query_prepared(q.clone(), values);
                }

                this.0.batch_with_params(queries.finalize().expect("Finalized"))
                    .expect("Batched write");
            });

            println!("Saved csdb items, took {:?} ", t);
            Ok(())
        });
    }
    pub fn last_ohlcs(&self) -> BoxFuture<(), ()> {
        return self.invoke(move |this, ctx| {
            #[derive(Clone, Debug, IntoCDRSValue, TryFromRow, PartialEq)]
            pub struct Pair {
                pub exchange: String,
                pub pair: String,
            }
            let pairs = this.0.query(r#"select distinct exchange,pair from main_ks.ohlc"#)
                .expect(":Query")
                .get_body()
                .expect("Body")
                .into_rows()
                .expect("Rows");

            for row in pairs {
                let pair = Pair::try_from_row(row).expect("Pairs");
                info!("Pair: {:?}", pair);
            }
            Ok(())
        });
    }
}