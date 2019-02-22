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

impl Message for NewUser {
    type Result = Result<User, diesel::result::Error>;
}

impl Handler<NewUser> for DbWorker {
    type Result = Result<User, diesel::result::Error>;

    fn handle(&mut self, msg: NewUser, _: &mut Self::Context) -> Self::Result {
        let conn: &ConnType = &self.0.get().unwrap();
        diesel::insert_into(users::table).values(&msg).get_result::<User>(conn)
    }
}

#[derive(Deserialize, Debug)]
pub struct UserLookup {
    pub id: i32
}

impl Message for UserLookup {
    type Result = Result<User, diesel::result::Error>;
}

impl Handler<UserLookup> for DbWorker {
    type Result = Result<User, diesel::result::Error>;

    fn handle(&mut self, msg: UserLookup, _: &mut Self::Context) -> Self::Result {
        use crate::schema::users::dsl::*;

        let conn: &ConnType = &self.0.get().unwrap();

        users.filter(id.eq(msg.id)).get_result::<User>(conn)
    }
}

#[derive(Deserialize, Validate, Serialize, Debug)]
pub struct UserLogin {
    #[validate(email(message = "Hmmm, invalid email provided."))]
    pub email: String,
    pub password: String,
}

impl Message for UserLogin {
    type Result = Result<User, diesel::result::Error>;
}

impl Handler<UserLogin> for DbWorker {
    type Result = Result<User, diesel::result::Error>;

    fn handle(&mut self, msg: UserLogin, _: &mut Self::Context) -> Self::Result {
        use crate::schema::users::dsl::*;

        let conn: &ConnType = &self.0.get().unwrap();
        users.filter(email.eq(msg.email)).get_result::<User>(conn)
    }
}