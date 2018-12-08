use crate::prelude::*;
use crate::users::middleware::UserAuthentication;

#[derive(Template)]
#[template(path = "users/me.html")]
pub struct Me {
    pub base : BaseTemplateInfo,
    pub user : db::User,
}

impl Me{
    pub async fn get(request: HttpRequest<State>) -> Result<HttpResponse> {
        let base = comp_await!(BaseTemplateInfo::from_request(&request))?;
        let user = comp_await!(request.state().db.send(db::UserLookup { id: 2 }))??;

        Ok(render(Me { base , user }))
    }
    pub async fn post((req,user) : (HttpRequest<State>, Form<db::User>)) -> Result<HttpResponse> {
        comp_await!(Self::get(req))
    }
}