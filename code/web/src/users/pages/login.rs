use crate::prelude::*;
use actix_web::{HttpRequest, HttpResponse};
use crate::users::middleware::UserAuthentication;


use db::UserLogin;


pub async fn get_async(request: HttpRequest<State>) -> Result<HttpResponse> {
    if request.is_authenticated() {
        return Ok(redirect_to(request, "homepage"));
    }
    let base: BaseTemplateInfo = await_compat!(BaseTemplateInfo::from_request(&request))?;
    Ok(render(|o| crate::templates::users::login(o, &base)))
}

pub async fn post_async((request, login): (HttpRequest<State>, Form<UserLogin>)) -> Result<HttpResponse> {
    let mut base: BaseTemplateInfo = await_compat!(BaseTemplateInfo::from_request(&request))?;

    let url = request.url_for("homepage", &[""; 0]).unwrap();
    let homepage = Ok(redirect(url.as_str()));

    if request.is_authenticated() {
        return homepage;
    }

    let login = login.into_inner();
    if let Err(e) = login.validate() {
        error!("Error : {:?}", e);
        base.errors = Some(collect_validation_errors(e));
        return Ok(render(move |o| crate::templates::users::login(o, &base)));
    }

    let password = login.password.clone();
    let res: Result<db::User, _> = await_compat!(request.state().db.send(login))?;

    return match res {
        Ok(user) => {
            if djangohashers::check_password(&password, &user.password).unwrap() {
                request.session().set("email", user.email).unwrap();
                request.session().set("uid", user.id).unwrap();
                homepage
            } else {
                base.errors = Some(vec!["Email or password is incorrect.".into()]);
                return Ok(render(|o| crate::templates::users::login(o, &base)));
            }
        }

        Err(e) => {
            warn!("Error locating user: {:?}", e);
            base.errors = Some(vec!["Email or password is incorrect.".into()]);
            return Ok(render(|o| crate::templates::users::login(o, &base)));
        }
    };
}

