use crate::prelude::*;
use crate::State;
use crate::utils::*;
use crate::users::middleware::UserAuthentication;
use std::string::ToString;
use actix_web::Path;
use common::types::OhlcPeriod;
use db::Database;

pub type EvalTuple = (db::Strategy, Vec<db::Evaluation>);


pub async fn list(req: HttpRequest<State>) -> Result<impl Responder> {
    let db: Database = req.state().db.clone();
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    require_login!(base);

    let mut items = vec![];

    let strats = await_compat!(db.user_strategies(base.auth.uid))?;
    for s in strats {
        let evals = await_compat!(db.get_evals(s.id))?;
        items.push((s,evals));
    }

    Ok(render(|o| crate::templates::evaluations::list(o, &base, items)))
}

pub fn configure(application: App<State>) -> App<State> {
    application
        .resource("/evaluations", |r| {
            r.method(Method::GET).with(compat(list));
        })
}

