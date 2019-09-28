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

    let trades = db.user_trades(base.auth.uid).compat().await?;
    Ok(Json(trades).respond_to(&req).unwrap())
}



pub fn configure(application: App<State>) -> App<State> {
    application
        .resource("/api/trades", |r| {
            r.method(Method::GET).with_async(compat(list));
        })
}

