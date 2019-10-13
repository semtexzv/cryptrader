#![feature(box_syntax)]
#![feature(type_alias_impl_trait)]
#![feature(arbitrary_self_types)]
#![recursion_limit = "128"]
#![allow(unused_imports, unused_variables)]

#[macro_use]
extern crate common;
#[macro_use]
pub extern crate diesel;
#[macro_use]
pub extern crate diesel_migrations;

pub extern crate validator;
#[macro_use]
pub extern crate validator_derive;

use diesel_migrations::*;
embed_migrations!("./migrations");

mod prelude;
#[cfg(feature = "scylla")]
mod scylla;

mod schema;


mod ohlc;
mod users;
mod traders;
mod strategies;
mod assignments;

use crate::prelude::*;

pub use crate::schema::*;

pub mod repo;

pub use crate::ohlc::*;
pub use crate::users::*;
pub use crate::traders::*;
pub use crate::strategies::*;
pub use crate::assignments::*;

fn db_url() -> String {
    format!("postgres://{}:{}@postgres.default.svc:5432/{}", "trader", "trader", "trader")
}

pub fn init_store() {
    info!("Initializing database");
    let url = db_url();
    let connection = diesel::PgConnection::establish(&url)
        .expect("Error connecting to DB");

    embedded_migrations::run(&connection).unwrap();
    info!("Migrations performed");
}

use diesel::r2d2::{PooledConnection, Pool, ConnectionManager};

pub type ConnType = PooledConnection<diesel::r2d2::ConnectionManager<diesel::PgConnection>>;
pub type PoolType = diesel::r2d2::Pool<diesel::r2d2::ConnectionManager<diesel::PgConnection>>;

pub struct DbWorker {
    pub pool: PoolType
}

impl DbWorker {
    pub fn conn(&self) -> ConnType {
        return self.pool.get().unwrap();
    }
}

pub fn start() -> Database {
    with_size(3)
}

fn with_size(count: usize) -> Database {
    init_store();
    let url = db_url();

    let manager = diesel::r2d2::ConnectionManager::new(url);
    let pool = diesel::r2d2::Pool::builder()
        .max_size(count as _)
        .build(manager)
        .expect("Failed to create connection pool");

    println!("Db should be created soon");
    return Database(DbWorker::start(move |_| DbWorker { pool: pool.clone() }));
}

impl Actor for DbWorker {}

#[derive(Clone)]
pub struct Database(Addr<DbWorker>);


use diesel::query_dsl::select_dsl::SelectDsl;
use diesel::query_builder::{AsQuery, Query};
use diesel::deserialize::QueryableByName;
use diesel::associations::{HasTable, BelongsTo, Identifiable};

use crate::repo::GetAllDsl;

impl_invoke!(DbWorker);


use diesel::pg::Pg;
use diesel::query_builder::QueryFragment;
use diesel::query_builder::QueryId;
use diesel::types::HasSqlType;