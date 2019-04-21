use crate::prelude::*;
use common::prelude::*;
use diesel::prelude::*;

use crate::{
    DbWorker,
    ConnType,
    schema::{self, users, ohlc, traders, User, Trader},
};
use crate::schema::Trade;

use validator::Validate;

#[derive(Insertable, AsChangeset, Deserialize, Serialize, Debug)]
#[table_name = "traders"]
pub struct NewTraderData {
    #[serde(skip_deserializing, skip_serializing)]
    pub user_id: i32,
    pub name: String,
    pub exchange: String,
    pub api_key: String,
    pub api_secret: String,
}


impl crate::Database {
    pub fn user_traders(&self, uid: i32) -> BoxFuture<Vec<Trader>> {
        self.invoke(move |this, ctx| {
            use crate::schema::traders::dsl::*;
            let conn: &ConnType = &this.0.get().unwrap();
            let q = traders.filter(user_id.eq(uid)).get_results(conn)?;
            Ok(q)
        })
    }

    pub fn save_trader(&self, trader: NewTraderData) -> BoxFuture<Trader> {
        self.invoke(move |this, ctx| {
            use crate::schema::traders::dsl::*;
            let conn: &ConnType = &this.0.get().unwrap();
            let q = diesel::insert_into(traders)
                .values(&trader)
                .on_conflict(id)
                .do_update()
                .set(&trader)
                .get_result::<Trader>(conn)?;
            Ok(q)
        })
    }

    pub fn delete_trader(&self, trader: Trader) -> BoxFuture<()> {
        self.invoke(move |this, ctx| {
            use crate::schema::traders::dsl::*;
            let conn: &ConnType = &this.0.get().unwrap();
            let q = diesel::delete(traders)
                .filter(id.eq(trader.id));

            q.execute(conn)?;
            Ok(())
        })
    }
}