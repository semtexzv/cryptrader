use crate::prelude::*;

pub mod middleware;

use actix_web::{
    http::Method, App,
    middleware::session::{
        SessionStorage, CookieSession, CookieSessionBackend,
    },
};
use super::State;
use crate::users::middleware::UserAuthentication;


use db::UserAuthInfo;
use db::validator::Validate;

pub async fn login((request, login): (HttpRequest<State>, Json<UserAuthInfo>)) -> Result<HttpResponse> {
    error!("Login");
    let base: BaseReqInfo = BaseReqInfo::from_request(&request).await?;

    let url = request.url_for("homepage", &[""; 0]).unwrap();
    let homepage = Ok(redirect(url.as_str()));

    let login = login.into_inner();
    if let Err(e) = login.validate() {
        error!("Error : {:?}", e);
        let resp = Json(collect_validation_errors(e));
        return Err(crate::prelude::Error::from_resp(&request, http::StatusCode::FORBIDDEN, resp));
    }

    let password = login.password.clone();
    let res: Result<db::User, _> = request.state().db.login(login).compat().await;


    return match res {
        Ok(ref user) if djangohashers::check_password(&password, &user.password) == Ok(true) => {
            request.session().set("email", user.email.clone()).unwrap();
            request.session().set("uid", user.id.clone()).unwrap();
            homepage
        }

        Ok(_) | Err(_) => {
            let resp: Json<Vec<String>> = Json(vec!["Email or password is incorrect.".into()]);
            return Err(crate::prelude::Error::from_resp(&request, http::StatusCode::FORBIDDEN, resp));
        }
    };
}


pub async fn signup((request, user): (HttpRequest<State>, Json<UserAuthInfo>)) -> Result<HttpResponse> {
    if request.is_authenticated() {
        return Ok(redirect_to(request, "homepage"));
    }

    let  base: BaseReqInfo = BaseReqInfo::from_request(&request).await?;

    let mut user = user.into_inner();

    user.password = djangohashers::make_password(&user.password);

    match request.state().db.new_user(user).compat().await {
        Ok(user) => {
            request.session().set("email", user.email).unwrap();
            request.session().set("uid", user.id).unwrap();

            let url = request.url_for("homepage", &[""; 0]).unwrap();
            Ok(redirect(url.as_str()))
        }
        Err(e) => {
            error!("Error creating new user: {:?}", e);
            return Ok(redirect_to(request, "homepage"));

        }
    }
}

pub fn logout(request: HttpRequest<State>) -> HttpResponse {
    request.session().clear();
    let url = request.url_for("homepage", &[""; 0]).unwrap();
    redirect(url.as_str())
}


pub fn configure(app: App<State>) -> App<State> {
    app.middleware(SessionStorage::new(
        CookieSessionBackend::private(&[42; 32])
            .secure(false)
            .name("_TSESSION")
    )).resource("/api/signup/", |r| {
        r.method(Method::POST).with_async(compat(signup));
    }).resource("/api/signin/", |r| {
        r.method(Method::POST).with_async(compat(login));
    }).resource("/api/logout/", |r| {
        r.method(Method::POST).with(logout);
    })
}