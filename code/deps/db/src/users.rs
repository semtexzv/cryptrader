use crate::prelude::*;
use diesel::prelude::*;

use crate::{
    DbWorker,
    ConnType,
    schema::{self, users, ohlc, traders, User, Trader},
};
use crate::schema::Trade;

use validator::Validate;


#[derive(Insertable, Validate, Deserialize, Serialize, Debug)]
#[table_name = "users"]
pub struct UserAuthInfo {
    #[validate(email(message = "Invalid email"))]
    pub email: String,
    pub password: String,
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
    pub async fn get_user(&self, uid: i32) -> Result<User, diesel::result::Error> {
        ActorExt::invoke(self.0.clone(), move |this| {
            use crate::schema::users::dsl::*;

            let conn: &ConnType = &this.pool.get().unwrap();

            let res = users.filter(id.eq(uid)).get_result::<User>(conn)?;
            Ok(res)
        }).await
    }
    pub async fn login(&self, login: UserAuthInfo) -> Result<User, diesel::result::Error> {
        ActorExt::invoke(self.0.clone(), move |this| {
            use crate::schema::users::dsl::*;

            let conn: &ConnType = &this.pool.get().unwrap();
            users.filter(email.eq(login.email)).get_result::<User>(conn)
        }).await
    }
    pub async fn new_user(&self, user: UserAuthInfo) -> Result<User, diesel::result::Error> {
        ActorExt::invoke(self.0.clone(), move |this| {
            let conn: &ConnType = &this.pool.get().unwrap();
            let r = diesel::insert_into(users::table).values(&user).get_result::<User>(conn)?;
            Ok(r)
        }).await
    }
}