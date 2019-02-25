use crate::prelude::*;
use crate::State;
use crate::utils::*;
use crate::users::middleware::UserAuthentication;
use std::string::ToString;
use actix_web::Path;
use common::types::OhlcPeriod;
use db::Database;

pub type StratTuple = (String, i32);

#[derive(Default, Debug)]
pub struct AssignmentItem {
    pub exchange: String,
    pub pair: String,

    pub period: Option<String>,
    pub strategy_id: Option<i32>,

    pub pi: isize,
    pub si: isize,
}

pub async fn list(req: HttpRequest<State>) -> Result<impl Responder> {
    let db: Database = req.state().db.clone();
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    require_login!(base);

    let pairs: Vec<db::Pair> = await_compat!(db.pairs())?;
    let assignments: Vec<db::Assignment> = await_compat!(db.assignments(base.auth.uid))?;
    let strategies: Vec<db::Strategy> = await_compat!(db.user_strategies(base.auth.uid))?;

    let periods: Vec<String> = OhlcPeriod::VALUES.iter().map(ToString::to_string).collect();

    let mut items = vec![];
    for db::Pair { exchange, pair } in pairs.iter() {
        let e = exchange;
        let p = pair;
        if let Some(ass) = assignments.iter().find(|a| &a.exchange == e && &a.pair == p) {
            let pi = periods.iter().position(|ee| ee == &ass.period).map(|i| i + 1).unwrap_or(0) as isize;
            let si = strategies.iter().position(|ee| ee.id == ass.strategy_id).map(|i| i + 1).unwrap_or(0) as isize;
            items.push(AssignmentItem {
                exchange: e.clone(),
                pair: p.clone(),

                period: Some(ass.period.clone()),
                strategy_id: Some(ass.strategy_id),
                pi,
                si,
            })
        } else {
            items.push(AssignmentItem {
                exchange: e.clone(),
                pair: p.clone(),
                ..Default::default()
            })
        }
    }
    let strategies = strategies.into_iter().map(|s| (s.name, s.id)).collect();

    Ok(render(|o| crate::templates::assignments::list(o, &base, items, periods, strategies)))
}


pub async fn post((req, mut form): (HttpRequest<State>, Form<db::Assignment>)) -> Result<impl Responder> {
    let db: Database = req.state().db.clone();
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    require_login!(base);


    form.owner_id = base.auth.uid;
    if form.strategy_id == 0 || form.period.to_lowercase() == "none" {
        await_compat!(db.delete_assignment(form.into_inner()))?;
    } else {
        await_compat!(db.save_assignment(form.into_inner()))?;
    }
    Ok(see_other("/assignments"))
}

pub fn configure(application: App<State>) -> App<State> {
    application
        .resource("/assignments", |r| {
            r.method(Method::GET).with(compat(list));
            r.method(Method::POST).with(compat(post));
        })
        .resource("/assignments/{exch}/{pair}", |r| {
            r.method(Method::POST).with(compat(post));
        })
}

