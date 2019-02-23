use common::prelude::*;
use diesel::prelude::*;
use diesel::query_dsl::InternalJoinDsl;

use crate::{
    DbWorker,
    ConnType,
    schema::{self, strategies, eval_requests},
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

#[derive(Insertable, AsChangeset, Validate, Deserialize, Serialize, Debug)]
#[table_name = "strategies"]
pub struct SaveStrategy {
    pub id: Option<i32>,
    pub owner: i32,
    pub body: String,
}


#[derive(Queryable, Insertable, AsChangeset, Serialize, Deserialize, Debug)]
pub struct EvalRequest {
    pub strategy_id: i32,
    pub exchange: String,
    pub pair: String,
    pub period: String,
}

impl crate::Database {
    pub fn strategy_data(&self, sid: i32) -> BoxFuture<(crate::Strategy, crate::User, Vec<EvalRequest>)> {
        return self.invoke(move |this, ctx| {
            use schema::strategies::dsl::*;
            use schema::users::dsl::*;
            use schema::eval_requests::dsl::*;

            let conn: &ConnType = &this.0.get().unwrap();
            let (strat, user) = strategies.find(sid).inner_join(users).get_result(conn)?;
            let req = eval_requests.filter(strategy_id.eq(sid)).get_results(conn)?;
            return Ok((strat, user, req));
        });
    }

    pub fn user_strategies(&self, uid: i32) -> BoxFuture<Vec<crate::Strategy>> {
        return self.invoke(move |this, ctx| {
            use schema::strategies::dsl::*;
            use schema::users::dsl::*;

            let conn: &ConnType = &this.0.get().unwrap();
            let strats = strategies.filter(owner.eq(uid)).load(conn)?;
            return Ok(strats);
        });
    }

    pub fn create_strategy(&self, owner_id: i32, s_body: String) -> BoxFuture<crate::Strategy> {
        return self.invoke(move |this, ctx| {
            use schema::strategies::dsl::*;
            use schema::users::dsl::*;

            let conn: &ConnType = &this.0.get().unwrap();
            let new = NewStrategy {
                owner: owner_id,
                body: s_body,
            };
            let s = diesel::insert_into(strategies)
                .values(&new)
                .get_result(conn)?;

            return Ok(s);
        });
    }

    pub fn save_strategy(&self, owner_id: i32, strat_id: Option<i32>, s_body: String) -> BoxFuture<crate::Strategy> {
        error!(":Saving strat : {} ", s_body);
        return self.invoke(move |this, ctx| {
            use schema::strategies::dsl::*;
            use schema::users::dsl::*;

            let conn: &ConnType = &this.0.get().unwrap();
            let new = SaveStrategy {
                id: strat_id,
                owner: owner_id,
                body: s_body.clone(),
            };
            let s = diesel::insert_into(strategies)
                .values(&new)
                .on_conflict(schema::strategies::id)
                .do_update()
                .set(body.eq(s_body))
                .get_result(conn)?;

            return Ok(s);
        });
    }

    pub fn eval_requests(&self) -> BoxFuture<Vec<crate::EvalRequest>> {
        return self.invoke(move |this, ctx| {
            let conn: &ConnType = &this.0.get().unwrap();
            let res = schema::eval_requests::table.load::<EvalRequest>(conn)?;
            Ok(res)
        });
    }
    pub fn add_eval_request(&self, req: EvalRequest) -> BoxFuture<EvalRequest> {
        self.invoke(move |this, ctx| {
            use schema::eval_requests::dsl::*;
            let conn: &ConnType = &this.0.get().unwrap();
            let s = diesel::insert_into(eval_requests)
                .values(&req)
                .on_conflict_do_nothing();
            s.execute(conn)?;

            let res = schema::eval_requests::table.load::<EvalRequest>(conn)?;

            Ok(req)
        })
    }

    pub fn remove_eval_request(&self, req: EvalRequest) -> BoxFuture<()> {
        self.invoke(move |this, ctx| {
            use schema::eval_requests::dsl::*;
            let conn: &ConnType = &this.0.get().unwrap();

            let s = diesel::delete(eval_requests
                .filter(
                    strategy_id.eq(req.strategy_id).and(
                        exchange.eq(req.exchange).and(
                            pair.eq(req.pair).and(
                                period.eq(req.period))))
                ));
            s.execute(conn)?;

            Ok(())
        })
    }
}