use crate::prelude::*;
use crate::users::middleware::UserAuthentication;


pub async fn get(request: HttpRequest<State>) -> Result<HttpResponse> {
    let base = await_compat!(BaseTemplateInfo::from_request(&request))?;
    let user = await_compat!(request.state().db.send(db::UserLookup { id: 2 }))??;

    Ok(render(|o| crate::templates::users::me(o, &base, &user)))
}

pub async fn post((req, user): (HttpRequest<State>, Form<db::User>)) -> Result<HttpResponse> {
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    await_compat!(get(req))
}
