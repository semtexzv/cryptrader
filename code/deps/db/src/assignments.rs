use crate::prelude::*;
use crate::Database;

impl Database {

    /*
    pub fn all_assignments(&self) -> BoxFuture<Vec<Assignment>> {
        return self.invoke(move |this, ctx| {
            use crate::schema::assignments::dsl::*;

            let conn: &ConnType = &this.0.get().unwrap();
            let res = assignments.load::<Assignment>(conn)?;
            Ok(res)
        });
    }

    */
    pub fn all_assignments_with_traders(&self) -> BoxFuture<Vec<(Assignment, Option<Trader>)>> {
        return self.invoke(move |this, ctx| {
            use crate::schema::assignments;
            use crate::schema::traders;

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
            let res = assignments.filter(user_id.eq(uid))
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
                .on_conflict((exchange, pair, user_id))
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
                .filter(user_id.eq(req.user_id));

            s.execute(conn)?;

            Ok(())
        })
    }
}