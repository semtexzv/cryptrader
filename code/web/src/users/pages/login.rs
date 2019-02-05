use crate::prelude::*;
use actix_web::{HttpRequest, HttpResponse};
use crate::users::middleware::UserAuthentication;


use db::UserLogin;

#[derive(Template)]
#[template(path = "users/login.html")]
pub struct Login {
    pub base: BaseTemplateInfo,
    pub errors: Option<Vec<String>>,
}


impl Login {
    pub async fn get_async(request: HttpRequest<State>) -> Result<HttpResponse> {
        if request.is_authenticated() {
            return Ok(redirect_to(request, "homepage"));
        }
        let base: BaseTemplateInfo = await_compat!(BaseTemplateInfo::from_request(&request))?;
        return Ok(render(Self { base, errors: None }));
    }

    pub async fn post_async((request, login): (HttpRequest<State>, Form<UserLogin>)) -> Result<HttpResponse> {
        let base: BaseTemplateInfo = await_compat!(BaseTemplateInfo::from_request(&request))?;

        let url = request.url_for("homepage", &[""; 0]).unwrap();
        let homepage = Ok(redirect(url.as_str()));

        if request.is_authenticated() {
            return homepage;
        }

        let login = login.into_inner();
        if let Err(e) = login.validate() {
            error!("Error : {:?}", e);
            return Ok(render(Self { base, errors: Some(collect_validation_errors(e)) }));
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
                    Ok(render(Self {
                        base,
                        errors: Some(vec!["Email or password is incorrect.".into()]),
                    }))
                }
            }

            Err(e) => {
                warn!("Error locating user: {:?}", e);
                Ok(render(Self {
                    base,
                    errors: Some(vec!["Email or password is incorrect.".into()]),
                }))
            }
        };
    }
}
