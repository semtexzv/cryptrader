use crate::prelude::*;
use crate::State;
use crate::utils::*;
use crate::users::middleware::UserAuthentication;
use std::string::ToString;
use actix_web::Path;
use common::types::OhlcPeriod;
use db::Database;

pub async fn list(req: HttpRequest<State>) -> Result<impl Responder> {
    let db: Database = req.state().db.clone();
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    require_login!(base);


    let traders = await_compat!(db.user_traders(base.auth.uid))?;
    Ok(render(|o| crate::templates::traders::list(o, &base, exchanges(), traders)))
}

pub async fn post((req, form): (HttpRequest<State>, Form<db::NewTrader>)) -> Result<impl Responder> {
    let db: Database = req.state().db.clone();
    let mut form = form.into_inner();
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    form.user_id = base.auth.uid;
    require_login!(base);

    let trader = await_compat!(db.add_trader(form))?;

    Ok(see_other("/traders"))
}

pub fn configure(application: App<State>) -> App<State> {
    application
        .resource("/traders", |r| {
            r.method(Method::GET).with(compat(list));
            r.method(Method::POST).with(compat(post));
        })
}

