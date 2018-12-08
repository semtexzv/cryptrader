use crate::prelude::*;

use std::borrow::Borrow;

use common::validator::ValidationErrors;
use common::futures::future::{Future, result};

pub use actix_web_async_await::{await as comp_await, compat};

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
    pub user: Option<db::User>,
    pub signed_in: bool,
}

#[derive(Debug, Serialize)]
pub struct BaseTemplateInfo {
    pub auth: AuthTemplateInfo
}

impl BaseTemplateInfo {
    pub fn from_request(req: &HttpRequest<super::State>) -> impl Future<Item=Self, Error=Error> {
        req.user().then(|user| {
            Ok(BaseTemplateInfo {
                auth: AuthTemplateInfo {
                    signed_in: user.is_ok(),
                    user: user.ok(),
                }
            })
        })
    }
}

#[derive(Deserialize, Serialize)]
pub struct OperationResponse<'a> {
    pub success: bool,
    pub message: Option<&'a str>,
}


pub type FutureResponse = Box<Future<Item=HttpResponse, Error=Error>>;

#[inline(always)]
pub fn render(template: impl Template) -> HttpResponse {
    HttpResponse::Ok().content_type("text/html").body(template.borrow().render().unwrap())
}

#[inline(always)]
pub fn async_render(template: &Template) -> FutureResponse {
    result(Ok(HttpResponse::Ok().content_type("text/html").body(template.render().unwrap()))).responder()
}

#[inline(always)]
pub fn redirect(location: &str) -> HttpResponse {
    HttpResponse::TemporaryRedirect().header("Location", location).finish()
}

#[inline(always)]
pub fn redirect_to<S>(req: HttpRequest<S>, name : &str) -> HttpResponse{ 
    let url = req.url_for(name, &[""; 0]).unwrap();
    return redirect(url.as_str());
}

#[inline(always)]
pub fn async_redirect(location: &str) -> FutureResponse {
    result(Ok(HttpResponse::TemporaryRedirect().header("Location", location).finish())).responder()
}