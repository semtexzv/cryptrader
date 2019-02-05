use crate::prelude::*;

use std::borrow::Borrow;

use common::validator::ValidationErrors;
use std::future::Future;

pub use actix_web_async_await::*;

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
}

#[derive(Debug, Serialize)]
pub struct BaseTemplateInfo {
    pub auth: AuthTemplateInfo
}

impl BaseTemplateInfo {
    pub async fn from_request(req: &HttpRequest<super::State>) -> Result<Self> {
        Ok(BaseTemplateInfo {
            auth: AuthTemplateInfo {
                signed_in: req.is_authenticated(),
                email: req.session().get("email").unwrap().unwrap_or("".into()),
            }
        })
    }
}


#[inline(always)]
pub fn render(template: impl Template) -> HttpResponse {
    HttpResponse::Ok().content_type("text/html").body(template.borrow().render().unwrap())
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
pub async fn async_render(template: impl Template) -> Result<HttpResponse> {
    Ok(HttpResponse::Ok().content_type("text/html").body(template.render().unwrap()))
}
#[inline(always)]
pub async fn async_redirect(location: &str) -> Result<HttpResponse> {
    Ok(HttpResponse::TemporaryRedirect().header("Location", location).finish())
}
