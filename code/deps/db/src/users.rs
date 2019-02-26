use common::prelude::*;
use diesel::prelude::*;

use crate::{
    DbWorker,
    ConnType,
    schema::{self, users, ohlc, traders, User, Trader},
};


#[derive(Insertable, Validate, Deserialize, Serialize, Debug)]
#[table_name = "users"]
pub struct NewUser {
    #[validate(email(message = "Hmmm, invalid email provided."))]
    pub email: String,
    pub password: String,
}


#[derive(Deserialize, Validate, Serialize, Debug)]
pub struct UserLogin {
    #[validate(email(message = "Hmmm, invalid email provided."))]
    pub email: String,
    pub password: String,
}

#[derive(Insertable, AsChangeset, Validate, Deserialize, Serialize, Debug)]
#[table_name = "traders"]
pub struct NewTrader {
    pub user_id: i32,
    pub name: String,
    pub exchange: String,
    pub api_key: String,
    pub api_secret: String,
}

impl Into<common::types::auth::AuthInfo> for Trader {
    fn into(self) -> common::types::auth::AuthInfo {
        common::types::auth::AuthInfo {
            key: self.api_key,
            secret: self.api_secret,
        }
    }
}

impl crate::Database {
    pub fn get_user(&self, uid: i32) -> BoxFuture<User, diesel::result::Error> {
        self.invoke::<_, _, diesel::result::Error>(move |this, ctx| {
            use crate::schema::users::dsl::*;

            let conn: &ConnType = &this.0.get().unwrap();

            let res = users.filter(id.eq(uid)).get_result::<User>(conn)?;
            Ok(res)
        })
    }
    pub fn login(&self, login: UserLogin) -> BoxFuture<User, diesel::result::Error> {
        self.invoke(move |this, ctx| {
            use crate::schema::users::dsl::*;

            let conn: &ConnType = &this.0.get().unwrap();
            users.filter(email.eq(login.email)).get_result::<User>(conn)
        })
    }
    pub fn new_user(&self, user: NewUser) -> BoxFuture<User, diesel::result::Error> {
        self.invoke(move |this, ctx| {
            let conn: &ConnType = &this.0.get().unwrap();
            let r = diesel::insert_into(users::table).values(&user).get_result::<User>(conn)?;
            Ok(r)
        })
    }


    pub fn user_traders(&self, uid: i32) -> BoxFuture<Vec<Trader>> {
        self.invoke(move |this, ctx| {
            use crate::schema::traders::dsl::*;
            let conn: &ConnType = &this.0.get().unwrap();
            let q = traders.filter(user_id.eq(uid)).get_results(conn)?;
            Ok(q)
        })
    }

    pub fn add_trader(&self, trader: NewTrader) -> BoxFuture<Trader> {
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