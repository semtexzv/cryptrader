use crate::prelude::*;
use diesel::prelude::*;

use crate::{
    DbWorker,
    ConnType,
    schema::{self, users, ohlc, traders, User, Trader, trades, Trade},
};

#[derive(Insertable, AsChangeset, Deserialize, Serialize, Debug)]
#[table_name = "traders"]
pub struct TraderData {
    #[serde(skip_deserializing, skip_serializing)]
    pub id: Option<i32>,
    #[serde(skip_deserializing, skip_serializing)]
    pub user_id: i32,
    pub name: String,
    pub exchange: String,
    pub api_key: String,
    pub api_secret: String,
}

#[derive(PartialEq, Deserialize, Serialize, Debug, Clone)]
#[derive(Insertable, AsChangeset)]
#[table_name = "trades"]
pub struct NewTradeData {
    #[serde(skip_deserializing, skip_serializing)]
    pub user_id: i32,
    pub trader_id: i32,

    pub pair_id: i32,

    pub buy: bool,
    pub amount: f64,
    pub price: f64,

    pub status: bool,
    pub ok: Option<String>,
    pub error: Option<String>,
}


impl crate::Database {
    pub async fn user_traders(&self, uid: i32) -> Result<Vec<Trader>> {
        ActorExt::invoke(self.0.clone(), move |this, ctx| {
            referenced_by::<Trader, User, _>(&uid).load(&this.conn())
        }).await
    }

    pub async fn save_trader(&self, trader: TraderData) -> Result<Trader> {
        self.0.invoke(move |this, ctx| {
            use crate::schema::traders::dsl::*;
            let conn: &ConnType = &this.pool.get().unwrap();
            let q = diesel::insert_into(traders)
                .values(&trader)
                .on_conflict(id)
                .do_update()
                .set(&trader)
                .get_result::<Trader>(conn)?;
            Ok(q)
        }).await
    }

    pub async fn delete_trader(&self, uid: i32, tid: i32) -> Result<bool> {
        self.0.invoke(move |this, ctx| {
            use crate::schema::traders::dsl::*;
            let conn: &ConnType = &this.pool.get().unwrap();
            let q = diesel::delete(traders)
                .filter(user_id.eq(uid))
                .filter(id.eq(tid));

            Ok(q.execute(conn)? > 0)
        }).await
    }

    pub async fn log_trade(&self, trade: NewTradeData) -> Result<Trade> {
        self.0.invoke(move |this, ctx| {
            use self::trades::dsl::*;

            diesel::insert_into(trades)
                .values(&trade)
                .on_conflict(id)
                .do_nothing()
                .get_result::<Trade>(&this.conn())
        }).await
    }

    pub async fn user_trades(&self, uid: i32) -> Result<Vec<Trade>> {
        ActorExt::invoke(self.0.clone(), move |this, ctx| {
            referenced_by::<Trade, User, _>(&uid)
                .order_by(schema::trades::time.desc())
                .limit(20)
                .load(&this.conn())
        }).await
    }
}