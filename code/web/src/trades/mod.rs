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
    let base = await_compat!(BaseReqInfo::from_request(&req))?;
    require_login!(base);

    let trades = await_compat!(db.user_trades(base.auth.uid))?;
    Ok(Json(trades).respond_to(&req).unwrap())
}



pub fn configure(application: App<State>) -> App<State> {
    application
        .resource("/api/trades", |r| {
            r.method(Method::GET).with(compat(list));
        })
}

