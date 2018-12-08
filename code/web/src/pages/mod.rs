use crate::prelude::*;

use common::futures::Future;
use askama::Template;
use actix_web::{http::Method, App};
use actix_web::{AsyncResponder, HttpRequest};

use super::State;
//use users::middleware::UserAuthentication;
//use users::models::User;
use crate::utils::*;
use crate::users::middleware::UserAuthentication;

use db::User;

#[derive(Template)]
#[template(path = "index.html")]
pub struct Homepage {
    base: BaseTemplateInfo
}

async fn root(req: HttpRequest<State>) -> Result<impl Responder> {
    let base = comp_await!(BaseTemplateInfo::from_request(&req))?;
    Ok(render(Homepage { base }))
}

pub fn configure(application: App<State>) -> App<State> {
    application
        .resource("/", |r| {
            r.name("homepage");
            r.method(Method::GET).with(compat(root));
            r.method(Method::POST).with(compat(root))
        })
}

