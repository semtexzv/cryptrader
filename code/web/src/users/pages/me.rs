use crate::prelude::*;
use crate::users::middleware::UserAuthentication;

#[derive(Template)]
#[template(path = "users/me.html")]
pub struct Me {
    pub base : BaseTemplateInfo,
    pub user : db::User,
}

impl Me {
    pub async fn get(request: HttpRequest<State>) -> Result<HttpResponse> {
        let base = await_compat!(BaseTemplateInfo::from_request(&request))?;
        let user = await_compat!(request.state().db.send(db::UserLookup { id: 2 }))??;

        Ok(render(Me { base , user }))
    }
    pub async fn post((req,user) : (HttpRequest<State>, Form<db::User>)) -> Result<HttpResponse> {
        await_compat!(Self::get(req))
    }
}