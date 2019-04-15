use crate::prelude::*;
use crate::State;
use crate::utils::*;
use crate::users::middleware::UserAuthentication;
use std::string::ToString;
use actix_web::Path;
use common::types::OhlcPeriod;
use db::Database;
use actix_web::Json;

pub async fn api_list(req: HttpRequest<State>) -> Result<impl Responder, actix_web::Error> {
    let db: Database = req.state().db.clone();
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    require_login!(base);

    let mut items = vec![];

    let strats = await_compat!(db.user_strategies(base.auth.uid))?;
    for s in strats {
        let evals = await_compat!(db.get_evals(s.id))?;
        items.extend_from_slice(&evals);
    }
    Ok(Json(items).respond_to(&req)?)
}

pub async fn api_list_evals((req, id) : (HttpRequest<State>, Path<i32>)) -> Result<impl Responder, actix_web::Error> {
    let db: Database = req.state().db.clone();
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    require_login!(base);

    // TODO: Ensure user is owner of S
    let evals = await_compat!(db.get_evals(id.into_inner()))?;
    Ok(Json(evals).respond_to(&req)?)
}

pub fn configure(application: App<State>) -> App<State> {
    application
        .resource("/api/evaluations/", |r| {
            r.method(Method::GET).with(compat(api_list));
        })
        .resource("/api/strategies/{id}/evaluations", |r| {
            r.method(Method::GET).with(compat(api_list_evals));
        })
}

