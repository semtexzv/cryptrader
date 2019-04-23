use crate::prelude::*;

use std::borrow::Borrow;


use db::validator::ValidationErrors;
use std::future::Future;
use actix_web::{http, HttpRequest, HttpResponse};
pub use actix_async_await::*;

use crate::users::middleware::UserAuthentication;


#[inline(always)]
pub fn collect_validation_errors(e: ValidationErrors) -> Vec<String> {
    e.field_errors().into_iter().map(|(_k, v)| {
        v.into_iter().map(|a| {
            format!("{:?}:{:?}", _k, a.message.unwrap().to_string())
        }).collect()
    }).collect()
}

#[derive(Debug, Serialize)]
pub struct AuthTemplateInfo {
    pub signed_in: bool,
    pub email: String,
    pub uid: i32,
}

#[derive(Debug, Serialize)]
pub struct BaseReqInfo {
    pub auth: AuthTemplateInfo,
}

impl BaseReqInfo {
    pub async fn from_request(req: &HttpRequest<super::State>) -> Result<Self> {
        Ok(BaseReqInfo {
            auth: AuthTemplateInfo {
                signed_in: req.is_authenticated(),
                email: req.session().get("email").unwrap().unwrap_or("".into()),
                uid: req.session().get("uid").unwrap().unwrap_or(0),
            },
        })
    }
}

#[inline(always)]
pub fn see_other(location: &str) -> HttpResponse {
    HttpResponse::SeeOther().header("Location", location).finish()
}


#[inline(always)]
pub fn redirect(location: &str) -> HttpResponse {
    HttpResponse::TemporaryRedirect().header("Location", location).finish()
}

#[inline(always)]
pub fn redirect_to<S>(req: HttpRequest<S>, name: &str) -> HttpResponse {
    let url = req.url_for(name, &[""; 0]).unwrap();
    return redirect(url.as_str());
}

#[inline(always)]
pub async fn async_redirect(location: &str) -> Result<HttpResponse> {
    Ok(HttpResponse::TemporaryRedirect().header("Location", location).finish())
}


pub fn render<F>(tpl: F) -> HttpResponse
    where F: FnOnce(&mut std::io::Write) -> std::io::Result<()>
{
    let mut out = Vec::new();
    let _ = tpl(&mut out);
    return HttpResponse::Ok().content_type("text/html").body(out);
}

#[macro_export]
macro_rules! require_login {
    ($base: expr) => {
        if !$base.auth.signed_in {
            return Ok(HttpResponse::Unauthorized().finish());

        }
    };
}


pub fn exchanges() -> Vec<String> {
    vec!["bitfinex".to_string()]
}

#[macro_export]
macro_rules! require_cond {
    ($cond: expr) => {
        if !$cond {
            return Ok(actix_web::error::ErrorUnauthorized("").into());
        }
    };
    ($cond: expr, $txt : expr) => {
        if !$cond {
            return Ok(actix_web::error::ErrorUnauthorized($txr).into());
        }
    };
}


