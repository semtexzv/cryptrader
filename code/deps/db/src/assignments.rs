use crate::prelude::*;
use crate::Database;
use common::types::Exchange;

impl Database {
    pub fn all_assignments_with_traders(&self) -> LocalBoxFuture<Result<Vec<(Assignment, Option<Trader>)>>> {
        ActorExt::invoke(self.0.clone(), move |this, ctx| {
            use crate::schema::assignments;
            use crate::schema::traders;

            let conn: &ConnType = &this.pool.get().unwrap();

            let res = assignments::table
                .left_outer_join(traders::table.on(assignments::trader_id.eq(traders::id.nullable())))
                .load(conn)?;

            Ok(res)
        }).boxed_local()
    }

    pub async fn assignments(&self, uid: i32) -> Result<Vec<Assignment>> {
        self.0.invoke(move |this, ctx| {
            referenced_by::<Assignment, User, _>(&uid).load(&this.conn())
        }).await
    }

    pub async fn save_assignment(&self, req: Assignment) -> Result<Assignment> {
        self.0.invoke(move |this, ctx| {
            use schema::assignments::dsl::*;
            let conn: &ConnType = &this.pool.get().unwrap();
            let s = diesel::insert_into(assignments)
                .values(&req)
                .on_conflict((pair_id, user_id))
                .do_update()
                .set((strategy_id.eq(&req.strategy_id), period.eq(&req.period)));

            s.execute(conn)?;

            let res = schema::assignments::table.load::<Assignment>(conn)?;

            Ok(req)
        }).await
    }

    pub async fn delete_assignment(&self, pair: PairId, uid: i32) -> Result<()> {
        ActorExt::invoke(self.0.clone(), move |this, ctx| {
            use schema::assignments::dsl::*;
            let conn: &ConnType = &this.pool.get().unwrap();

            let pid = schema::pair_id(pair.exch().to_string(), pair.pair().to_string());

            diesel::delete(assignments)
                .filter(pair_id.eq(pid))
                .filter(user_id.eq(user_id))
                .execute(conn)?;

            Ok(())
        }).await
    }
}