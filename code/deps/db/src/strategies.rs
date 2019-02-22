use common::prelude::*;
use diesel::prelude::*;
use diesel::query_dsl::InternalJoinDsl;

use crate::{
    DbWorker,
    ConnType,
    schema::{self, strategies},
};

#[derive(Queryable, Serialize, Deserialize, Debug)]
pub struct Strategy {
    pub id: i32,
    pub owner: i32,
    pub body: String,
    pub created: chrono::NaiveDateTime,
    pub updated: chrono::NaiveDateTime,
}

#[derive(Insertable, Validate, Deserialize, Serialize, Debug)]
#[table_name = "strategies"]
pub struct NewStrategy {
    pub owner: i32,
    pub body: String,
}

impl Message for NewStrategy {
    type Result = Result<Strategy, diesel::result::Error>;
}


impl Handler<NewStrategy> for DbWorker {
    type Result = Result<Strategy, diesel::result::Error>;

    fn handle(&mut self, msg: NewStrategy, _: &mut Self::Context) -> Self::Result {
        let conn: &ConnType = &self.0.get().unwrap();
        diesel::insert_into(strategies::table).values(&msg).get_result::<Strategy>(conn)
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct GetStratData { pub id: i32 }

impl Message for GetStratData { type Result = Result<StratEvalData>; }

#[derive(Debug, Deserialize, Serialize)]
pub struct StratEvalData {
    strat: Strategy,
    user: crate::users::User,
}

impl Handler<GetStratData> for DbWorker {
    type Result = Result<StratEvalData>;

    fn handle(&mut self, msg: GetStratData, ctx: &mut Self::Context) -> Self::Result {
        use schema::strategies::dsl::*;
        use schema::users::dsl::*;

        let conn: &ConnType = &self.0.get().unwrap();
        let (strat, user) = strategies.find(msg.id).inner_join(users).get_result(conn)?;
        return Ok(StratEvalData {
            strat,user
        });
    }
}


#[derive(Queryable, Serialize, Deserialize, Debug)]
pub struct EvalRequest {
    pub strategy_id: i32,
    pub exchange: String,
    pub pair: String,
    pub period: String,
}

#[derive(Debug, Clone)]
pub struct AllRequests;

impl Message for AllRequests { type Result = Result<Vec<EvalRequest>>; }

impl Handler<AllRequests> for DbWorker {
    type Result = Result<Vec<EvalRequest>>;

    fn handle(&mut self, msg: AllRequests, _: &mut Self::Context) -> Self::Result {
        let conn: &ConnType = &self.0.get().unwrap();
        let res = schema::eval_requests::table.load::<EvalRequest>(conn)?;
        return Ok(res);
    }
}