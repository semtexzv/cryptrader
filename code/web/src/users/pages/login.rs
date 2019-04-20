use crate::prelude::*;
use actix_web::{HttpRequest, HttpResponse};
use crate::users::middleware::UserAuthentication;


use db::UserLogin;
use db::validator::Validate;


pub async fn post_async((request, login): (HttpRequest<State>, Form<UserLogin>)) -> Result<HttpResponse> {
    error!("Login");
    let mut base: BaseTemplateInfo = await_compat!(BaseTemplateInfo::from_request(&request))?;

    let url = request.url_for("homepage", &[""; 0]).unwrap();
    let homepage = Ok(redirect(url.as_str()));

    let login = login.into_inner();
    if let Err(e) = login.validate() {
        error!("Error : {:?}", e);
        base.errors = Some(collect_validation_errors(e));
        return Ok(redirect_to(request, "homepage"));
    }

    let password = login.password.clone();
    let res: Result<db::User, _> = await_compat!(request.state().db.login(login));

    return match res {
        Ok(user) => {
            if djangohashers::check_password(&password, &user.password).unwrap() {
                request.session().set("email", user.email).unwrap();
                request.session().set("uid", user.id).unwrap();
                homepage
            } else {
                base.errors = Some(vec!["Email or password is incorrect.".into()]);
                return Ok(redirect_to(request, "homepage"));
            }
        }

        Err(e) => {
            warn!("Error locating user: {:?}", e);
            base.errors = Some(vec!["Email or password is incorrect.".into()]);
            return Ok(redirect_to(request, "homepage"));
        }
    };
}

