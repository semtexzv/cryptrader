use crate::prelude::*;

pub mod middleware;
pub mod pages;

use actix_web::{
    http::Method, App,
    middleware::session::{
        SessionStorage, CookieSession, CookieSessionBackend,
    },
};
use super::State;
use crate::users::middleware::UserAuthentication;

async fn dispatch(req: HttpRequest<State>) -> Result<impl Responder> {
    if req.is_authenticated() {
        return Ok(redirect_to(req, "homepage"));
    } else {
        return Ok(redirect("/app/login"));
    }
}

pub fn configure(app: App<State>) -> App<State> {
    app.middleware(SessionStorage::new(
        CookieSessionBackend::private(&[42; 32])
            .secure(false)
            .name("_TSESSION")
    )).resource("/users/", |r| {
        r.method(Method::GET).with(compat(dispatch))
    }).resource("/users/signup/", |r| {
        r.method(Method::POST).with(compat(pages::signup::post));
    }).resource("/users/signin/", |r| {
        r.method(Method::POST).with(compat(pages::login::post_async));
    }).resource("/users/logout/", |r| {
        r.method(Method::POST).with(pages::logout);
    })
}