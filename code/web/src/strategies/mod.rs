use crate::prelude::*;

use common::futures::Future;
use actix_web::{http::Method, App, Json};
use actix_web::{AsyncResponder, HttpRequest};

use super::State;

use crate::utils::*;
use crate::users::middleware::UserAuthentication;

use db::User;
use db::Database;

#[derive(Serialize, Deserialize, Default, Debug)]
pub struct StrategyInfo {
    pub name: String,
    pub body: String,
}

use actix_web::Path;
use common::types::OhlcPeriod;


pub async fn save_strat(req: HttpRequest<State>, id: Option<i32>, info: StrategyInfo) -> Result<db::Strategy> {
    info!("Save strat: {:?}, {:?}", id, info);
    let db: Database = req.state().db.clone();

    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    let name: String = info.name;
    let body: String = info.body;
    let strat = await_compat!(db.save_strategy(base.auth.uid, id, name,body))?;

    Ok(strat)
}

async fn api_list(req: HttpRequest<State>) -> Result<impl Responder> {
    let db: Database = req.state().db.clone();
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    require_login!(base);

    let strats = await_compat!(db.user_strategies(base.auth.uid))?;
    Ok(Json(strats).respond_to(&req).unwrap())
}


async fn api_detail((req, id): (HttpRequest<State>, Path<i32>)) -> Result<impl Responder> {
    let db: Database = req.state().db.clone();
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    require_login!(base);

    let (strat, user) = await_compat!(db.strategy_data(id.into_inner()))?;
    let evals = await_compat!(db.get_evals(strat.id))?;
    require_cond!(strat.owner_id == base.auth.uid);

    Ok(Json(strat).respond_to(&req).unwrap())
}

async fn api_create((req, data): (HttpRequest<State>, Json<StrategyInfo>)) -> Result<impl Responder> {
    let base = await_compat!(BaseTemplateInfo::from_request(& req))?;
    require_login!(base);
    let strat = await_compat!(save_strat(req.clone(), None, data.into_inner()))?;
    Ok(Json(strat).respond_to(&req).unwrap())
}

async fn api_save((req, id, data): (HttpRequest<State>, Path<i32>, Json<StrategyInfo>)) -> Result<impl Responder> {
    let base = await_compat!(BaseTemplateInfo::from_request(& req))?;

    require_login!(base);
    let id = id.into_inner();
    let strat = await_compat!(save_strat(req.clone(), Some(id), data.into_inner()))?;
    Ok(Json(strat).respond_to(&req).unwrap())
}


pub fn configure(application: App<State>) -> App<State> {
    application
        .resource("/api/strategies", |r| {
            r.method(Method::GET).with(compat(api_list));
            r.method(Method::POST).with(compat(api_create));
        })
        .resource("/api/strategies/{id}", |r| {
            r.method(Method::GET).with(compat(api_detail));
            r.method(Method::POST).with(compat(api_save));
        })
}

