use crate::prelude::*;

use common::futures::Future;
use actix_web::{http::Method, App};
use actix_web::{AsyncResponder, HttpRequest};

use super::State;
use crate::utils::*;
use crate::users::middleware::UserAuthentication;

use db::User;

async fn root(req: HttpRequest<State>) -> Result<impl Responder> {
    Ok(redirect("/app"))
}

pub fn configure(application: App<State>) -> App<State> {
    application
        .resource("/", |r| {
            r.name("homepage");
            r.method(Method::GET).with(compat(root));
            r.method(Method::POST).with(compat(root))
        })
}

