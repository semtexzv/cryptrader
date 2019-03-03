use crate::prelude::*;
use crate::users::middleware::UserAuthentication;

pub mod signup;

pub mod login;


pub fn logout(request: HttpRequest<State>) -> HttpResponse {
    request.session().clear();
    let url = request.url_for("homepage", &[""; 0]).unwrap();
    redirect(url.as_str())
}
