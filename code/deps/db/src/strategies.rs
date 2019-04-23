use crate::prelude::*;
use schema::strategies;

#[derive(Insertable, AsChangeset, Deserialize, Serialize, Debug)]
#[table_name = "strategies"]
pub struct StrategyData {
    #[serde(skip_serializing, skip_deserializing)]
    pub id: Option<i32>,
    #[serde(skip_serializing, skip_deserializing)]
    pub user_id: i32,

    pub name: String,
    pub body: String,
}


impl crate::Database {
    pub fn strategy_data(&self, sid: i32) -> BoxFuture<(crate::Strategy, crate::User)> {
        return self.invoke(move |this, ctx| {
            debug!("Receiving strategy data");
            use schema::strategies::dsl::*;
            use schema::users::dsl::*;

            let conn: &ConnType = &this.0.get().unwrap();
            let (strat, user) = strategies.find(sid).inner_join(users).get_result(conn)?;
            return Ok((strat, user));
        });
    }

    pub fn single_strategy(&self, sid: i32) -> BoxFuture<crate::Strategy> {
        return self.invoke(move |this, ctx| {
            debug!("Receiving strategy source : {:?}", sid);
            use schema::strategies::dsl::*;
            use schema::users::dsl::*;

            let conn: &ConnType = &this.0.get().unwrap();
            let strat = strategies.find(sid).get_result(conn)?;
            debug!("Got strategy source : {:?}", sid);
            return Ok(strat);
        });
    }

    pub fn user_strategies(&self, uid: i32) -> BoxFuture<Vec<crate::Strategy>> {
        return self.invoke(move |this, ctx| {
            use schema::strategies::dsl::*;
            use schema::users::dsl::*;

            let conn: &ConnType = &this.0.get().unwrap();
            let strats = strategies.filter(user_id.eq(uid)).load(conn)?;
            return Ok(strats);
        });
    }

    pub fn save_strategy(&self, data: StrategyData) -> BoxFuture<crate::Strategy> {
        return self.invoke(move |this, ctx| {
            use schema::strategies::dsl::*;
            use schema::users::dsl::*;

            let conn: &ConnType = &this.0.get().unwrap();

            let s = diesel::insert_into(strategies)
                .values(&data)
                .on_conflict(schema::strategies::id)
                .do_update()
                .set(&data)
                .get_result(conn)?;

            return Ok(s);
        });
    }

    pub fn delete_strategy(&self, uid : i32, sid : i32) -> BoxFuture<bool> {
        return self.invoke(move |this, ctx| {
            use schema::strategies::dsl::*;


            let conn: &ConnType = &this.0.get().unwrap();
            let q = diesel::delete(strategies)
                .filter(user_id.eq(uid))
                .filter(id.eq(sid));

            Ok(q.execute(conn)? > 0)
        });
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
    /*
    pub fn user_evals(&self, uid: i32) -> BoxFuture<Vec<Evaluation>> {
        self.invoke(move |this, _| {
            use schema::evaluations::dsl::*;
            let conn: &ConnType = &this.0.get().unwrap();
            let r = evaluations
                .inner_join(schema::strategies::dsl::strategies)
                .inner_join(schema::users::dsl::users)
                .filter(schema::strategies::dsl::id.eq(uid))
                .order_by(time.desc())
                .limit(10)
                .get_results(conn)?;

            Ok(r)
        })
    }

*/
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