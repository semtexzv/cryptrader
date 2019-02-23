use crate::prelude::*;

use common::futures::Future;
use actix_web::{http::Method, App};
use actix_web::{AsyncResponder, HttpRequest};

use super::State;
use crate::utils::*;
use crate::users::middleware::UserAuthentication;

use db::User;
use db::Database;

#[derive(Serialize, Deserialize,Default)]
pub struct StrategyInfo {
    pub body: String
}

async fn list(req: HttpRequest<State>) -> Result<impl Responder> {
    let db : Database = req.state().db.clone();
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    let strats = await_compat!(db.user_strategies(base.auth.uid))?;
    Ok(render(|o| crate::templates::strategies::list(o, &base,strats)))
}
use actix_web::Path;
use db::EvalRequest;


pub async fn save_strat(req : HttpRequest<State>, id : Option<i32>,  info : Option<StrategyInfo>) -> Result<db::Strategy> {
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    let db : Database = req.state().db.clone();
    let strat = await_compat!(db.save_strategy(base.auth.uid, id, info.map(|x| x.body).unwrap_or(String::new())))?;

    Ok(strat)

}
async fn post((req, id,form) : (HttpRequest<State>,Option<Path<i32>>, Option<Form<StrategyInfo>>) ) -> Result<impl Responder> {
    let strat : db::Strategy = if let Some(id) = id {
        let id = id.into_inner();
        await_compat!(save_strat(req,Some(id),form.map(Form::into_inner)))?
    } else {
        await_compat!(save_strat(req,None,form.map(Form::into_inner)))?
    };
    Ok(see_other(&format!("/strategies/{}",strat.id)))
}

async fn detail((req,id) : (HttpRequest<State>, Path<i32>)) -> Result<impl Responder> {
    let db : Database = req.state().db.clone();
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    let (strat,user, evals) = await_compat!(db.strategy_data(id.into_inner()))?;

    let exchanges = vec!["bitfinex".to_string()];
    let pairs = vec!["btc:usd".to_string()];
    let periods = vec!["1m".to_string()];

    Ok(render(|o| crate::templates::strategies::detail(o, &base, exchanges,pairs,periods,evals, strat)))
}

async fn detail_post(req: HttpRequest<State>) -> Result<impl Responder> {
    let db : Database = req.state().db.clone();
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    let strats = await_compat!(db.user_strategies(base.auth.uid))?;
    Ok(render(|o| crate::templates::strategies::list(o, &base,strats)))
}

async fn evals((req,sid,form) : (HttpRequest<State>,Path<i32>, Form<EvalRequest>) )-> Result<impl Responder> {
    let db : Database = req.state().db.clone();
    let ev = await_compat!(db.add_eval_request(form.into_inner()))?;


    Ok(see_other(&format!("/strategies/{}",sid)))
}
async fn delete_eval((req,sid,form) : (HttpRequest<State>,Path<i32>, Form<EvalRequest>) )-> Result<impl Responder> {
    let db : Database = req.state().db.clone();
    let ev = await_compat!(db.remove_eval_request(form.into_inner()))?;


    Ok(see_other(&format!("/strategies/{}",sid)))
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
        .resource("/strategies/{id}/evals",|r| {
            r.method(Method::POST).with(compat(evals));
        })
        .resource("/strategies/{id}/delete-eval", |r| {
            r.method(Method::POST).with(compat(delete_eval));
        })
}

