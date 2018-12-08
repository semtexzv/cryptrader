use crate::prelude::*;
use crate::users::middleware::UserAuthentication;


use db::UserLogin;

#[derive(Template)]
#[template(path = "users/login.html")]
pub struct Login {
    pub base: BaseTemplateInfo,
    pub errors: Option<Vec<String>>,
}


impl Login {
    pub async fn get_async(request : HttpRequest<State>) -> Result<HttpResponse> {
         if request.is_authenticated() {
            return Ok(redirect_to(request, "homepage"));
        }
        let base: BaseTemplateInfo = comp_await!(BaseTemplateInfo::from_request(&request))?;
        return Ok(render(Self { base, errors: None, }));
    }

    pub async fn post_async((request, login): (HttpRequest<State>, Form<UserLogin>)) -> Result<HttpResponse> {
        let base: BaseTemplateInfo = comp_await!(BaseTemplateInfo::from_request(&request))?;

        let url = request.url_for("homepage", &[""; 0]).unwrap();
        let homepage =  Ok(redirect(url.as_str()));

        if request.is_authenticated() {
            return homepage;
        }

        let login = login.into_inner();
        if let Err(e) = login.validate() {
            error!("Error : {:?}", e);
            return Ok(render(Self { base, errors: Some(collect_validation_errors(e)) }));
        }

        let password = login.password.clone();
        let res: Result<db::User, _> = comp_await!(request.state().db.send(login))?;

        return match res {
            Ok(user) => {
                if djangohashers::check_password(&password, &user.password).unwrap() {
                    request.session().set("email",user.email).unwrap();
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
                    base: unimplemented!(),
                    errors: Some(vec!["Email or password is incorrect.".into()]),
                }))
            }
        };
    }


    /*
    pub fn get(request: HttpRequest<State>) -> HttpResponse {
        if request.is_authenticated() {
            return redirect_to(request, "homepage");
        }

        render(Self {
            base: unimplemented!(),
            errors: None,
        })
    }

    pub fn post((request, login): (HttpRequest<State>, Form<UserLogin>)) -> FutureResponse {
        if request.is_authenticated() {
            let url = request.url_for("homepage", &[""; 0]).unwrap();
            return async_redirect(url.as_str());
        }

        let login = login.into_inner();
        if let Err(e) = login.validate() {
            error!("Error : {:?}", e);
            return async_render(&Self {
                base: unimplemented!(),
                errors: Some(collect_validation_errors(e)),
            });
        }

        let password = login.password.clone();
        request.state().db.send(login).from_err().and_then(move |res| match res {
            Ok(user) => {
                if djangohashers::check_password(&password, &user.password).unwrap() {
                    println!("Setting cookie of : {:?}", user.id);
                    if let Err(e) = request.session().set("uid", user.id) {
                        error!("Could not set UID for user session! {:?}", e);
                        return Ok(render(Self {
                            base: unimplemented!(),
                            errors: Some(vec!["An internal error occurred while attempting to sign you in. Please try again in a bit.".into()]),
                        }));
                    }

                    let url = request.url_for("homepage", &[""; 0]).unwrap();
                    Ok(redirect(url.as_str()))
                } else {
                    Ok(render(Self {
                        base: unimplemented!(),
                        errors: Some(vec!["Email or password is incorrect.".into()]),
                    }))
                }
            }

            Err(e) => {
                warn!("Error locating user: {:?}", e);
                Ok(render(Self {
                    base: unimplemented!(),
                    errors: Some(vec!["Email or password is incorrect.".into()]),
                }))
            }
        }).responder()
    }
    */
}
