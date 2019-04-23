use crate::prelude::*;

use common::futures::Future;
use actix_web::{http::Method, App};
use actix_web::{AsyncResponder, HttpRequest};

use super::State;
use crate::utils::*;
use crate::users::middleware::UserAuthentication;

use db::{User, Database};
use common::types::OhlcPeriod;

async fn root(req: HttpRequest<State>) -> Result<impl Responder> {
    Ok(redirect("/app"))
}

pub async fn pairs(req: HttpRequest<State>) -> Result<impl Responder> {
    let db: Database = req.state().db.clone();
    let base = await_compat!(BaseReqInfo::from_request(&req))?;
    let pairs: Vec<db::Pair> = await_compat!(db.pairs())?;

    Ok(Json(pairs).respond_to(&req)?)
}

pub  async fn periods(req: HttpRequest<State>) -> Result<impl Responder> {
    #[derive(Serialize)]
    struct P {
        text: &'static str
    }
    Ok(Json(OhlcPeriod::NAMES.iter().map(|p| P { text: p }).collect::<Vec<_>>()))
}


pub fn configure(application: App<State>) -> App<State> {
    application
        .resource("/", |r| {
            r.name("homepage");
            r.method(Method::GET).with(compat(root));
            r.method(Method::POST).with(compat(root))
        })

        .resource("/api/pairs", |r| {
            r.method(Method::GET).with(compat(pairs));
        })
        .resource("/api/periods", |r| {
            r.method(Method::GET).with(compat(periods));
        })
}

