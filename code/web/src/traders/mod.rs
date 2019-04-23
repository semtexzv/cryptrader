use crate::prelude::*;
use crate::State;
use crate::utils::*;
use crate::users::middleware::UserAuthentication;
use common::types::OhlcPeriod;
use db::Database;


pub async fn list(req: HttpRequest<State>) -> Result<impl Responder> {
    let db: Database = req.state().db.clone();
    let base = await_compat!(BaseReqInfo::from_request(&req))?;
    require_login!(base);

    let traders = await_compat!(db.user_traders(base.auth.uid))?;

    Ok(Json(traders).respond_to(&req)?)
}

pub async fn post((req, id, form): (HttpRequest<State>, Option<Path<i32>>, Json<db::TraderData>)) -> Result<impl Responder> {
    let db: Database = req.state().db.clone();
    let mut form = form.into_inner();

    let base = await_compat!(BaseReqInfo::from_request(&req))?;
    form.user_id = base.auth.uid;
    if let Some(id) = id {
        form.id = Some(id.into_inner());
    }
    require_login!(base);
    let trader = await_compat!(db.save_trader(form))?;
    Ok(Json(trader).respond_to(&req)?)
}

pub async fn delete((req, id): (HttpRequest<State>, Path<i32>)) -> Result<impl Responder> {
    let db: Database = req.state().db.clone();
    let base = await_compat!(BaseReqInfo::from_request(&req))?;
    require_login!(base);

    await_compat!(db.delete_trader(base.auth.uid,id.into_inner()))?;

    return Ok(HttpResponse::new(http::StatusCode::OK));
}

pub fn configure(application: App<State>) -> App<State> {
    application
        .resource("/api/traders", |r| {
            r.method(Method::GET).with(compat(list));
            r.method(Method::POST).with(compat(post));
        })
        .resource("/api/traders/{id}", |r| {
            r.method(Method::POST).with(compat(post));
            r.method(Method::DELETE).with(compat(delete));
        })
}

