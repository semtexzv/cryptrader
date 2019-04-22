pub use common::{
    prelude::*,
    actix_web::{
        self,
        http::{
            self,
            Method,
        },
        dev::*,
        Responder, HttpRequest, App, AsyncResponder, server, HttpResponse,
        Form, Path, Json,
        middleware::session::RequestSession,
    },
};
pub use db::diesel;
pub use crate::utils::*;
pub use crate::State;

pub use actix_async_await::await as await_compat;


#[derive(Debug, Fail)]
pub struct Error(actix_web::Error);

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        <actix_web::Error as fmt::Display>::fmt(&self.0, f)
    }
}

impl From<actix_web::Error> for Error {
    fn from(e: actix_web::Error) -> Self {
        Error(e)
    }
}

impl From<diesel::result::Error> for Error {
    fn from(e: diesel::result::Error) -> Self {
        Error(actix_web::error::ErrorInternalServerError("".to_string()))
    }
}

impl actix_web::ResponseError for Error {
    fn error_response(&self) -> HttpResponse {
        self.0.as_response_error().error_response()
    }
}

impl Error {
    pub fn from_resp(req: &HttpRequest<State>, code: http::StatusCode, resp: impl Responder<Item=HttpResponse>) -> Self {
        let resp: StdResult<HttpResponse, _> = resp.respond_to(req)
            .map(|r| r.into());
        match resp {
            Ok(mut resp) => {
                *resp.status_mut() = code;
                return Self(actix_web::error::InternalError::from_response("", resp).into());
            }
            Err(e) => {
                return Self(e.into());
            }
        }
    }
}


pub type Result<I, E = Error> = std::result::Result<I, E>;