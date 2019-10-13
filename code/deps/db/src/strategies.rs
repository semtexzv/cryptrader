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
    pub async fn strategy_data(&self, sid: i32) -> Result<(crate::Strategy, crate::User)> {
        ActorExt::invoke(self.0.clone(), move |this| {
            debug!("Receiving strategy data");
            let conn: &ConnType = &this.pool.get().unwrap();
            Strategy::identified_by(&sid)
                .inner_join(schema::users::table).get_result(&this.conn())
        }).await
    }

    pub fn single_strategy(&self, sid: i32) -> impl Future<Output=Result<crate::Strategy>> {
        self.0.invoke(move |this| {
            debug!("Receiving strategy source : {:?}", sid);
            Strategy::identified_by(&sid).get_result(&this.conn())
        })
    }

    pub async fn user_strategies(&self, uid: i32) -> Result<Vec<crate::Strategy>> {
        ActorExt::invoke(self.0.clone(), move |this| {
            referenced_by::<Strategy, User, _>(&uid).load(&this.conn())
        }).await
    }

    pub async fn save_strategy(&self, data: StrategyData) -> Result<crate::Strategy> {
        ActorExt::invoke(self.0.clone(), move |this| {
            use schema::strategies::dsl::*;
            use schema::users::dsl::*;

            let conn: &ConnType = &this.pool.get().unwrap();

            let s = diesel::insert_into(strategies)
                .values(&data)
                .on_conflict(schema::strategies::id)
                .do_update()
                .set(&data)
                .get_result(conn)?;

            return Ok(s);
        }).await
    }

    pub async fn delete_strategy(&self, uid: i32, sid: i32) -> Result<bool> {
        ActorExt::invoke(self.0.clone(), move |this| {
            use schema::strategies::dsl::*;


            let conn: &ConnType = &this.pool.get().unwrap();
            let q = diesel::delete(strategies)
                .filter(user_id.eq(uid))
                .filter(id.eq(sid));

            Ok(q.execute(conn)? > 0)
        }).await
    }


    pub async fn log_eval(&self, res: Evaluation) -> Result<Evaluation> {
        ActorExt::invoke(self.0.clone(), move |this| {
            use schema::evaluations::dsl::*;
            let conn: &ConnType = &this.pool.get().unwrap();

            let res = diesel::insert_into(evaluations)
                .values(&res)

                .get_result(conn)?;


            Ok(res)
        }).await
    }
    pub async fn user_evals(&self, uid: i32) -> Result<Vec<Evaluation>> {
        self.0.invoke(move |this| {
            use schema::evaluations::dsl::*;

            referenced_by::<Evaluation, User, _>(&uid)
                .order_by(time.desc())
                .limit(10)
                .get_results(&this.conn())
        }).await
    }
    pub async fn strategy_evals(&self, sid: i32) -> Result<Vec<Evaluation>> {
        ActorExt::invoke(self.0.clone(), move |this| {
            referenced_by::<Evaluation, Strategy, _>(&sid)
                .order_by(schema::evaluations::time.desc())
                .limit(10)
                .get_results(&this.conn())
        }).await
    }
}