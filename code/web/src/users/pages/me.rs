use crate::prelude::*;
use crate::users::middleware::UserAuthentication;

#[derive(Template)]
#[template(path = "users/me.html")]
pub struct Me {
    pub base : BaseTemplateInfo,
}

impl Me{
    pub async fn get(request: HttpRequest<State>) -> Result<HttpResponse> {
        let base = comp_await!(BaseTemplateInfo::from_request(&request))?;
        Ok(render(Me { base }))
    }
}