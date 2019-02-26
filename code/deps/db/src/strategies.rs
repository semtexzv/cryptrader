use crate::prelude::*;
use diesel::query_dsl::InternalJoinDsl;
use schema::strategies;


#[derive(Insertable, Validate, Deserialize, Serialize, Debug)]
#[table_name = "strategies"]
pub struct NewStrategy {
    pub owner_id: i32,
    pub name: String,
    pub body: String,
}

#[derive(Insertable, AsChangeset, Validate, Deserialize, Serialize, Debug)]
#[table_name = "strategies"]
pub struct SaveStrategy {
    pub id: Option<i32>,
    pub owner_id: i32,
    pub name: String,
    pub body: String,
}


impl crate::Database {
    pub fn strategy_data(&self, sid: i32) -> BoxFuture<(crate::Strategy, crate::User)> {
        return self.invoke(move |this, ctx| {
            use schema::strategies::dsl::*;
            use schema::users::dsl::*;

            let conn: &ConnType = &this.0.get().unwrap();
            let (strat, user) = strategies.find(sid).inner_join(users).get_result(conn)?;
            return Ok((strat, user));
        });
    }

    pub fn user_strategies(&self, uid: i32) -> BoxFuture<Vec<crate::Strategy>> {
        return self.invoke(move |this, ctx| {
            use schema::strategies::dsl::*;
            use schema::users::dsl::*;

            let conn: &ConnType = &this.0.get().unwrap();
            let strats = strategies.filter(owner_id.eq(uid)).load(conn)?;
            return Ok(strats);
        });
    }

    pub fn create_strategy(&self, new: NewStrategy) -> BoxFuture<crate::Strategy> {
        return self.invoke(move |this, ctx| {
            use schema::strategies::dsl::*;
            use schema::users::dsl::*;

            let conn: &ConnType = &this.0.get().unwrap();
            let s = diesel::insert_into(strategies)
                .values(&new)
                .get_result(conn)?;

            return Ok(s);
        });
    }

    pub fn save_strategy(&self, oid: i32, strat_id: Option<i32>, s_name: String, s_body: String) -> BoxFuture<crate::Strategy> {
        return self.invoke(move |this, ctx| {
            use schema::strategies::dsl::*;
            use schema::users::dsl::*;

            let conn: &ConnType = &this.0.get().unwrap();
            let new = SaveStrategy {
                id: strat_id,
                name: s_name,
                owner_id: oid,
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

    pub fn all_assignments(&self) -> BoxFuture<Vec<Assignment>> {
        return self.invoke(move |this, ctx| {
            use crate::schema::assignments::dsl::*;

            let conn: &ConnType = &this.0.get().unwrap();
            let res = assignments.load::<Assignment>(conn)?;
            Ok(res)
        });
    }

    pub fn all_assignments_with_traders(&self) -> BoxFuture<Vec<(Assignment, Option<Trader>)>> {
        return self.invoke(move |this, ctx| {
            use crate::schema::*;

            let conn: &ConnType = &this.0.get().unwrap();

            let res = assignments::table
                .left_outer_join(traders::table.on(assignments::trader_id.eq(traders::id.nullable())))
                .load(conn)?;

            Ok(res)
        });
    }
    pub fn assignments(&self, uid: i32) -> BoxFuture<Vec<Assignment>> {
        return self.invoke(move |this, ctx| {
            use crate::schema::assignments::dsl::*;

            let conn: &ConnType = &this.0.get().unwrap();
            let res = assignments.filter(owner_id.eq(uid))
                .load::<Assignment>(conn)?;
            Ok(res)
        });
    }

    pub fn save_assignment(&self, req: Assignment) -> BoxFuture<Assignment> {
        self.invoke(move |this, ctx| {
            use schema::assignments::dsl::*;
            let conn: &ConnType = &this.0.get().unwrap();
            let s = diesel::insert_into(assignments)
                .values(&req)
                .on_conflict((exchange, pair, owner_id))
                .do_update()
                .set((strategy_id.eq(&req.strategy_id), period.eq(&req.period)));

            s.execute(conn)?;

            let res = schema::assignments::table.load::<Assignment>(conn)?;

            Ok(req)
        })
    }

    pub fn delete_assignment(&self, req: Assignment) -> BoxFuture<()> {
        self.invoke(move |this, _| {
            use schema::assignments::dsl::*;
            let conn: &ConnType = &this.0.get().unwrap();

            let s = diesel::delete(assignments)
                .filter(exchange.eq(req.exchange))
                .filter(pair.eq(req.pair))
                .filter(owner_id.eq(req.owner_id));

            s.execute(conn)?;

            Ok(())
        })
    }

    pub fn log_eval(&self, res: Evaluation) -> BoxFuture<Evaluation> {
        self.invoke(move |this, _| {
            use schema::evaluations::dsl::*;
            let conn: &ConnType = &this.0.get().unwrap();

            let res = diesel::insert_into(evaluations)
                .values(&res)

                .get_result(conn)?;


            Ok(res)
        })
    }

    pub fn get_evals(&self, sid: i32) -> BoxFuture<Vec<Evaluation>> {
        self.invoke(move |this, _| {
            use schema::evaluations::dsl::*;
            let conn: &ConnType = &this.0.get().unwrap();
            let r = evaluations.filter(strategy_id.eq(sid))
                .order_by(time.desc())
                .limit(10)
                .get_results(conn)?;

            Ok(r)
        })
    }
}