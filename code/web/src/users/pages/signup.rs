use crate::prelude::*;
use crate::users::middleware::UserAuthentication;

use db::NewUser;

pub async fn post((request, user): (HttpRequest<State>, Form<NewUser>)) -> Result<HttpResponse> {
    if request.is_authenticated() {
        return Ok(redirect_to(request, "homepage"));
    }

    let  base: BaseTemplateInfo = await_compat!(BaseTemplateInfo::from_request(&request))?;

    let mut user = user.into_inner();

    user.password = djangohashers::make_password(&user.password);

    match await_compat!(request.state().db.new_user(user)) {
        Ok(user) => {
            request.session().set("email", user.email).unwrap();
            request.session().set("uid", user.id).unwrap();

            let url = request.url_for("homepage", &[""; 0]).unwrap();
            Ok(redirect(url.as_str()))
        }
        Err(e) => {
            error!("Error creating new user: {:?}", e);
            return Ok(redirect_to(request, "homepage"));
            /*
            Ok(render(Self {
                base,
                errors: Some(vec![
                    "An error occurred while trying to create your account. We've \
                        notified the engineering team and are looking into it - feel \
                        free to contact us for more information, or if you continue to \
                        see the issue after a short period.".into()
                ]),
            }))
            */
        }
    }
}
