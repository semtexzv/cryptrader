use common::prelude::*;
use diesel::prelude::*;

use crate::{
    DbWorker,
    ConnType,
    schema::{self, users, ohlc},
};

#[derive(Queryable, Serialize, Deserialize, Debug)]
pub struct User {
    pub id: i32,
    pub name: Option<String>,
    pub email: String,
    pub password: String,
    pub avatar: Option<String>,
    pub is_verified: bool,
    pub has_verified_email: bool,
    pub created: chrono::NaiveDateTime,
    pub updated: chrono::NaiveDateTime,
}

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
}