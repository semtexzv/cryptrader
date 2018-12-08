use crate::prelude::*;
use crate::users::middleware::UserAuthentication;

mod me;
pub use self::me::*;

mod signup;
pub use self::signup::*;

mod login;
pub use self::login::*;


pub fn logout(request: HttpRequest<State>) -> HttpResponse {
    request.session().clear();
    let url = request.url_for("homepage", &[""; 0]).unwrap();
    redirect(url.as_str())
}
