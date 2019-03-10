use crate::prelude::*;
use crate::State;
use crate::utils::*;
use crate::users::middleware::UserAuthentication;
use std::string::ToString;
use actix_web::Path;
use common::types::OhlcPeriod;
use db::Database;
use actix_web::Json;


pub struct TraderData {

}


pub async fn api_post((req, form): (HttpRequest<State>, Json<db::NewTrader>)) -> Result<impl Responder> {
    let db: Database = req.state().db.clone();
    let mut form = form.into_inner();
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    form.user_id = base.auth.uid;
    require_login!(base);

    let trader = await_compat!(db.add_trader(form))?;

    Ok(see_other("/api/traders"))
}

pub async fn api_list(req: HttpRequest<State>) -> Result<impl Responder, actix_web::Error> {
    let db: Database = req.state().db.clone();
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    require_login!(base);

    let traders = await_compat!(db.user_traders(base.auth.uid))?;
    Ok(Json(traders).respond_to(&req)?)
}

pub fn configure(application: App<State>) -> App<State> {
    application
        .resource("/api/traders", |r| {
            r.method(Method::GET).with(compat(api_list));
            r.method(Method::POST).with(compat(api_post));
        })
}
