use crate::prelude::*;

use common::futures::Future;
use actix_web::{http::Method, App};
use actix_web::{AsyncResponder, HttpRequest};

use super::State;
use crate::utils::*;
use crate::users::middleware::UserAuthentication;

use db::User;

#[derive(Serialize, Deserialize)]
pub struct StrategyInfo {
    pub body: String
}

async fn list(req: HttpRequest<State>) -> Result<impl Responder> {
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    Ok(render(|o| crate::templates::strategies::list(o, &base)))
}

async fn detail(req: HttpRequest<State>) -> Result<impl Responder> {
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    let id = req.match_info().get("id").unwrap();
    Ok(render(|o| crate::templates::strategies::list(o, &base)))
}

async fn detail_post((req, form): (HttpRequest<State>, Form<StrategyInfo>)) -> Result<impl Responder> {
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    let id = req.match_info().get("id").unwrap();
    Ok(render(|o| crate::templates::strategies::list(o, &base)))
}

pub fn configure(application: App<State>) -> App<State> {
    application
        .resource("/strategies", |r| {
            r.method(Method::GET).with(compat(list));
        })
        .resource("/strategies/{id}", |r| {
            r.method(Method::GET).with(compat(detail));
            r.method(Method::POST).with(compat(detail_post));
        })
}

