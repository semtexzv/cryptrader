#![feature(box_syntax)]
#![allow(unused_imports, unused_variables)]

#[macro_use]
extern crate common;
#[macro_use]
pub extern crate diesel;
#[macro_use]
pub extern crate diesel_migrations;
pub extern crate r2d2;
pub extern crate r2d2_diesel;

pub extern crate validator;

#[macro_use]
pub extern crate validator_derive;

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
        .max_size(8)
        .build(manager)
        .expect("Failed to create connection pool");

    return Database(SyncArbiter::start(4, move || DbWorker(pool.clone())));
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



