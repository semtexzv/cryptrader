use crate::prelude::*;
use crate::State;
use crate::utils::*;
use crate::users::middleware::UserAuthentication;
use std::string::ToString;
use actix_web::Path;
use common::types::OhlcPeriod;
use db::{Database, Assignment};
use actix_web::Json;

pub async fn list(req: HttpRequest<State>) -> Result<impl Responder> {
    let db: Database = req.state().db.clone();
    let base = await_compat!(BaseReqInfo::from_request(&req))?;
    require_login!(base);

    let pairs: Vec<db::Pair> = await_compat!(db.pairs())?;
    let assignments: Vec<db::Assignment> = await_compat!(db.assignments(base.auth.uid))?;
    let strategies: Vec<db::Strategy> = await_compat!(db.user_strategies(base.auth.uid))?;

    Ok(Json(assignments).respond_to(&req)?)
}

#[derive(Default, Debug, Clone, Deserialize, Serialize)]
pub struct Assign {
    pub strategy_id: i32,
    pub trader_id: Option<i32>,
}

pub async fn post((req, path, data): (HttpRequest<State>, Path<(String, String, String)>, Json<Assign>)) -> Result<impl Responder> {
    let (exch, pair, period) = path.into_inner();
    let data = data.into_inner();

    let db: Database = req.state().db.clone();
    let base = await_compat!(BaseReqInfo::from_request(&req))?;
    require_login!(base);
    let assign = Assignment {
        exchange: exch,
        pair: pair,
        period: period,
        user_id: base.auth.uid,
        strategy_id: data.strategy_id,
        trader_id: data.trader_id,
    };
    let res = await_compat!(db.save_assignment(assign))?;
    return Ok(Json(res).respond_to(&req).unwrap());
}

pub async fn delete((req, path): (HttpRequest<State>, Path<(String, String, String)>)) -> Result<impl Responder> {
    let (exch, pair, period) = path.into_inner();
    let db: Database = req.state().db.clone();
    let base = await_compat!(BaseReqInfo::from_request(&req))?;
    require_login!(base);
    let assign = Assignment {
        exchange: exch,
        pair: pair,
        period: period,
        user_id: base.auth.uid,
        strategy_id: 0,
        trader_id: None,
    };
    await_compat!(db.delete_assignment(assign))?;
    return Ok(HttpResponse::new(http::StatusCode::OK));
}

pub fn configure(application: App<State>) -> App<State> {
    application
        .resource("/api/assignments/{exch}/{pair}/{period}", |r| {
            r.method(Method::POST).with(compat(post));
            r.method(Method::DELETE).with(compat(delete));
        })
        .resource("/api/assignments", |r| {
            r.method(Method::GET).with(compat(list));
        })
}

