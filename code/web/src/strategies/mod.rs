use crate::prelude::*;

use common::futures::Future;
use actix_web::{http::Method, App, Json};
use actix_web::{AsyncResponder, HttpRequest};

use super::State;

use crate::utils::*;
use crate::users::middleware::UserAuthentication;

use db::User;
use db::Database;
use actix_web::Path;
use common::types::OhlcPeriod;


async fn list(req: HttpRequest<State>) -> Result<impl Responder> {
    let db: Database = req.state().db.clone();
    let base = BaseReqInfo::from_request(&req).await?;
    require_login!(base);

    let strats = db.user_strategies(base.auth.uid).await?;
    Ok(Json(strats).respond_to(&req).unwrap())
}


async fn get((req, id): (HttpRequest<State>, Path<i32>)) -> Result<impl Responder> {
    let db: Database = req.state().db.clone();
    let base = BaseReqInfo::from_request(&req).await?;
    require_login!(base);

    let (strat, user) = db.strategy_data(id.into_inner()).await?;
    let evals = db.strategy_evals(strat.id).await?;
    require_cond!(strat.user_id == base.auth.uid);

    Ok(Json(strat).respond_to(&req)?)
}

async fn post((req, id, data): (HttpRequest<State>, Option<Path<i32>>, Json<db::StrategyData>)) -> Result<impl Responder> {
    let base = BaseReqInfo::from_request(&req).await?;
    let db: Database = req.state().db.clone();
    require_login!(base);

    let mut data = data.into_inner();
    data.user_id = base.auth.uid;
    if let Some(id) = id {
        data.id = Some(id.into_inner());
    }

    let strat = db.save_strategy(data).await?;
    Ok(Json(strat).respond_to(&req)?)
}


async fn delete((req, id): (HttpRequest<State>, Path<i32>)) -> Result<impl Responder> {
    let base = BaseReqInfo::from_request(&req).await?;
    let db: Database = req.state().db.clone();

    require_login!(base);
    let _ = db.delete_strategy(base.auth.uid,id.into_inner()).await?;
    return Ok(HttpResponse::new(http::StatusCode::OK));
}


pub fn configure(application: App<State>) -> App<State> {
    application
        .resource("/api/strategies", |r| {
            r.method(Method::GET).with_async(compat(list));
            r.method(Method::POST).with_async(compat(post));
        })
        .resource("/api/strategies/{id}", |r| {
            r.method(Method::GET).with_async(compat(get));
            r.method(Method::POST).with_async(compat(post));
            r.method(Method::DELETE).with_async(compat(delete));
        })
}

