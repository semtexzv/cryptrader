use crate::prelude::*;
use crate::State;
use crate::utils::*;
use crate::users::middleware::UserAuthentication;
use std::string::ToString;
use actix_web::Path;
use common::types::OhlcPeriod;
use db::Database;
use actix_web::Json;

pub type StratTuple = (String, i32);


#[derive(Default, Debug,Clone, Deserialize, Serialize)]
pub struct AssignmentItem {
    pub exchange: String,
    pub pair: String,

    pub period: Option<String>,
    pub strategy_id: Option<i32>,

    pub trader_id: Option<i32>,
}

impl AssignmentItem {
    fn to_db(self, oid : i32) -> db::Assignment {
        db::Assignment {
            exchange: self.exchange,
            pair : self.pair,
            owner_id : oid,
            period : self.period.unwrap_or("1m".into()),
            strategy_id : self.strategy_id.unwrap_or(0),
            trader_id : self.trader_id,
        }
    }
}
pub async fn pairs(req : HttpRequest<State>) -> Result<impl Responder, actix_web::Error> {
    let db: Database = req.state().db.clone();
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    let pairs: Vec<db::Pair> = await_compat!(db.pairs())?;

    Ok(Json(pairs).respond_to(&req)?)
}


pub async fn api_list(req: HttpRequest<State>) -> Result<impl Responder, actix_web::Error> {
    let db: Database = req.state().db.clone();
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    require_login!(base);

    let pairs: Vec<db::Pair> = await_compat!(db.pairs())?;
    let assignments: Vec<db::Assignment> = await_compat!(db.assignments(base.auth.uid))?;
    let strategies: Vec<db::Strategy> = await_compat!(db.user_strategies(base.auth.uid))?;

    Ok(Json(assignments).respond_to(&req)?)
}

pub async fn api_post((req,  data): (HttpRequest<State>, Json<AssignmentItem>)) -> Result<impl Responder> {
    let db: Database = req.state().db.clone();
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    require_login!(base);

    let internal_data = data.clone().to_db(base.auth.uid);
    if data.strategy_id.is_none() || data.period.is_none() {
        await_compat!(db.delete_assignment(internal_data))?;
    } else {
        await_compat!(db.save_assignment(internal_data))?;
    }
    Ok(see_other("/app/assignments"))
}

pub fn configure(application: App<State>) -> App<State> {
    application
        .resource("/api/pairs", |r| {
            r.method(Method::GET).with(compat(pairs));
        })
        .resource("/api/assignments", |r| {
            r.method(Method::GET).with(compat(api_list));
            r.method(Method::POST).with(compat(api_post));
        })
}
