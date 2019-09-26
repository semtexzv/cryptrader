use crate::prelude::*;
use crate::State;
use crate::utils::*;
use crate::users::middleware::UserAuthentication;
use common::types::OhlcPeriod;
use db::Database;


pub async fn list(req: HttpRequest<State>) -> Result<impl Responder> {
    let db: Database = req.state().db.clone();
    let base = BaseReqInfo::from_request(&req).await?;
    require_login!(base);

    let traders = db.user_traders(base.auth.uid).compat().await?;

    Ok(Json(traders).respond_to(&req)?)
}

pub async fn post((req, id, form): (HttpRequest<State>, Option<Path<i32>>, Json<db::TraderData>)) -> Result<impl Responder> {
    let db: Database = req.state().db.clone();
    let mut form = form.into_inner();

    let base = BaseReqInfo::from_request(&req).await?;
    form.user_id = base.auth.uid;
    if let Some(id) = id {
        form.id = Some(id.into_inner());
    }
    require_login!(base);
    let trader = db.save_trader(form).compat().await?;
    Ok(Json(trader).respond_to(&req)?)
}

pub async fn delete((req, id): (HttpRequest<State>, Path<i32>)) -> Result<impl Responder> {
    let db: Database = req.state().db.clone();
    let base = BaseReqInfo::from_request(&req).await?;
    require_login!(base);

    db.delete_trader(base.auth.uid,id.into_inner()).compat().await?;

    return Ok(HttpResponse::new(http::StatusCode::OK));
}

pub fn configure(application: App<State>) -> App<State> {
    application
        .resource("/api/traders", |r| {
            r.method(Method::GET).with_async((list));
            r.method(Method::POST).with_async((post));
        })
        .resource("/api/traders/{id}", |r| {
            r.method(Method::POST).with_async((post));
            r.method(Method::DELETE).with_async((delete));
        })
}

