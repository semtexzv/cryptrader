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

async fn list(req: HttpRequest<State>) -> Result<impl Responder> {
    let db: Database = req.state().db.clone();
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    require_login!(base);

    let strats = await_compat!(db.user_strategies(base.auth.uid))?;
    Ok(render(|o| crate::templates::strategies::list(o, &base, strats)))
}

use actix_web::Path;
use common::types::OhlcPeriod;


pub async fn save_strat(req: HttpRequest<State>, id: Option<i32>, info: Option<StrategyInfo>) -> Result<db::Strategy> {
    info!("Save strat: {:?}, {:?}", id, info);
    let db: Database = req.state().db.clone();

    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    let name: String = info.as_ref().map(|x| x.name.clone()).unwrap_or(String::new());
    let body: String = info.as_ref().map(|x| x.body.clone()).unwrap_or(String::new());
    let strat = await_compat!(db.save_strategy(base.auth.uid, id, name,body))?;

    Ok(strat)
}

async fn post((req, id, form): (HttpRequest<State>, Option<Path<i32>>, Option<Form<StrategyInfo>>)) -> Result<impl Responder> {


    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    require_login!(base);
    //TODO: Verify strategy belongs to user

    let strat: db::Strategy = if let Some(id) = id {
        let id = id.into_inner();
        await_compat!(save_strat(req,Some(id),form.map(Form::into_inner)))?
    } else {
        await_compat!(save_strat(req,None,form.map(Form::into_inner)))?
    };
    Ok(see_other(&format!("/strategies/{}", strat.id)))
}

async fn detail((req, id): (HttpRequest<State>, Path<i32>)) -> Result<impl Responder> {
    let db: Database = req.state().db.clone();
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    require_login!(base);

    let (strat, user) = await_compat!(db.strategy_data(id.into_inner()))?;
    let evals = await_compat!(db.get_evals(strat.id))?;


    require_cond!(strat.owner_id == base.auth.uid);


    Ok(render(|o| crate::templates::strategies::detail(o, &base, strat, evals)))
}

async fn detail_post(req: HttpRequest<State>) -> Result<impl Responder> {
    let db: Database = req.state().db.clone();
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    require_login!(base);

    let strats = await_compat!(db.user_strategies(base.auth.uid))?;
    Ok(render(|o| crate::templates::strategies::list(o, &base, strats)))
}

async fn api_list(req : HttpRequest<State>) -> Result<impl Responder> {
    let db: Database = req.state().db.clone();
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    require_login!(base);

    let strats = await_compat!(db.user_strategies(base.auth.uid))?;
    Ok(Json(strats).respond_to(&req)?)

}

pub fn configure(application: App<State>) -> App<State> {
    application
        .resource("/strategies", |r| {
            r.method(Method::GET).with(compat(list));
            r.method(Method::POST).with(compat(post));
        })
        .resource("/strategies/{id}", |r| {
            r.method(Method::GET).with(compat(detail));
            r.method(Method::POST).with(compat(post));
        })
        .resource("/api/strategies", |r| {
            r.method(Method::GET).with(compat(api_list))
        })
        .resource("/api/strategies/{id}", |r| {
            r.method(Method::GET).with(compat(api_list))
        })
}

