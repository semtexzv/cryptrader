use crate::prelude::*;
use crate::users::middleware::UserAuthentication;

use db::NewUser;

#[derive(Template)]
#[template(path = "users/signup.html")]
pub struct Signup {
    pub base: BaseTemplateInfo,
    pub errors: Option<Vec<String>>,
}

impl Signup {
    pub async fn get(request: HttpRequest<State>) -> Result<impl Responder> {
        if request.is_authenticated() {
            return Ok(redirect_to(request, "homepage"));
        }

        let base: BaseTemplateInfo = comp_await!(BaseTemplateInfo::from_request(&request))?;
        return Ok(render(Self { base, errors: None }));
    }


    pub async fn post((request, user): (HttpRequest<State>, Form<NewUser>)) -> Result<HttpResponse> {
        if request.is_authenticated() {
            return Ok(redirect_to(request, "homepage"));
        }

        let base: BaseTemplateInfo = comp_await!(BaseTemplateInfo::from_request(&request))?;

        let mut user = user.into_inner();
        if let Err(e) = user.validate() {
            return Ok(render(Self { base, errors: Some(collect_validation_errors(e)) }));
        }

        user.password = djangohashers::make_password(&user.password);

        match comp_await!(request.state().db.send(user))? {
            Ok(user) => {
                if let Err(e) = request.session().set("uid", user.id) {
                    error!("Could not set UID for user session! {:?}", e);
                    return Ok(render(Self {
                        base: unimplemented!(),
                        errors: Some(vec![
                            "Your account was created, but an internal error happened while \
                            attempting to sign you in. Try again in a bit!".into()
                        ]),
                    }));
                }

                let url = request.url_for("homepage", &[""; 0]).unwrap();
                Ok(redirect(url.as_str()))
            }
            Err(e) => {
                error!("Error creating new user: {:?}", e);
                Ok(render(Self {
                    base: unimplemented!(),
                    errors: Some(vec![
                        "An error occurred while trying to create your account. We've \
                        notified the engineering team and are looking into it - feel \
                        free to contact us for more information, or if you continue to \
                        see the issue after a short period.".into()
                    ]),
                }))
            }
        }
    }
}
