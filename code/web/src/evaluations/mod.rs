use crate::prelude::*;
use crate::State;
use crate::utils::*;
use crate::users::middleware::UserAuthentication;
use std::string::ToString;
use actix_web::Path;
use common::types::OhlcPeriod;
use db::{Database, Evaluation};
use actix_web::Json;

pub async fn list_latest(req: HttpRequest<State>) -> Result<impl Responder> {
    let db: Database = req.state().db.clone();
    let base = BaseReqInfo::from_request(&req).await?;
    require_login!(base);

    let mut items: Vec<Evaluation> = vec![];

    let strats = db.user_strategies(base.auth.uid).compat().await?;
    for s in strats {
        let evals = db.get_evals(s.id).compat().await?;
        items.extend_from_slice(&evals);
    }
    items.sort_by_key(|i| i.time);
    items.reverse();
    items = items.into_iter().take(15).collect();
    Ok(Json(items).respond_to(&req)?)
}

pub async fn list_for_strat((req, id): (HttpRequest<State>, Path<i32>)) -> Result<impl Responder> {
    let db: Database = req.state().db.clone();
    let base = BaseReqInfo::from_request(&req).await?;
    require_login!(base);

    // TODO: Ensure user is owner of S
    let evals = db.get_evals(id.into_inner()).compat().await?;
    Ok(Json(evals).respond_to(&req)?)
}

pub fn configure(application: App<State>) -> App<State> {
    application
        .resource("/api/evaluations/", |r| {
            r.method(Method::GET).with_async(compat(list_latest));
        })
        .resource("/api/strategies/{id}/evaluations", |r| {
            r.method(Method::GET).with_async(compat(list_for_strat));
        })
}

