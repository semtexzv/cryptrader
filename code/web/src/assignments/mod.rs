use crate::prelude::*;
use crate::State;
use crate::utils::*;
use crate::users::middleware::UserAuthentication;
use std::string::ToString;
use actix_web::Path;
use common::types::OhlcPeriod;
use db::{Database, Assignment};
use actix_web::Json;

pub type StratTuple = (String, i32);


#[derive(Default, Debug, Clone, Deserialize, Serialize)]
pub struct AssignmentItem {
    pub exchange: String,
    pub pair: String,

    pub period: Option<String>,
    pub strategy_id: Option<i32>,

    pub trader_id: Option<i32>,
}

impl AssignmentItem {
    fn to_db(self, oid: i32) -> db::Assignment {
        db::Assignment {
            exchange: self.exchange,
            pair: self.pair,
            user_id: oid,
            period: self.period.unwrap_or("1m".into()),
            strategy_id: self.strategy_id.unwrap_or(0),
            trader_id: self.trader_id,
        }
    }
}

pub async fn pairs(req: HttpRequest<State>) -> Result<impl Responder> {
    let db: Database = req.state().db.clone();
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    let pairs: Vec<db::Pair> = await_compat!(db.pairs())?;

    Ok(Json(pairs).respond_to(&req)?)
}

pub  async fn periods(req: HttpRequest<State>) -> Result<impl Responder> {
    #[derive(Serialize)]
    struct P {
        text: &'static str
    }
    Ok(Json(OhlcPeriod::NAMES.iter().map(|p| P { text: p }).collect::<Vec<_>>()))
}


pub async fn api_list(req: HttpRequest<State>) -> Result<impl Responder> {
    let db: Database = req.state().db.clone();
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    require_login!(base);

    let pairs: Vec<db::Pair> = await_compat!(db.pairs())?;
    let assignments: Vec<db::Assignment> = await_compat!(db.assignments(base.auth.uid))?;
    let strategies: Vec<db::Strategy> = await_compat!(db.user_strategies(base.auth.uid))?;

    Ok(Json(assignments).respond_to(&req)?)
}

pub async fn api_post((req, data): (HttpRequest<State>, Json<AssignmentItem>)) -> Result<impl Responder> {
    let db: Database = req.state().db.clone();
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    require_login!(base);

    let internal_data = data.clone().to_db(base.auth.uid);
    if data.strategy_id.is_none() || data.period.is_none() {
        await_compat!(db.delete_assignment(internal_data))?;
    } else {
        return Ok(Json(await_compat!(db.save_assignment(internal_data))?).respond_to(&req)?);
    }
    return Ok(HttpResponse::new(http::StatusCode::OK));
}


#[derive(Default, Debug, Clone, Deserialize, Serialize)]
pub struct Assign {
    pub strategy_id: i32,
    pub trader_id: Option<i32>,
}


pub async fn post_one((req, path, data): (HttpRequest<State>, Path<(String, String, String)>, Json<Assign>)) -> Result<impl Responder> {
    let (exch, pair, period) = path.into_inner();
    let data = data.into_inner();

    let db: Database = req.state().db.clone();
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    require_login!(base);
    let assign = Assignment {
        exchange: exch,
        pair: pair,
        period: period,
        user_id: base.auth.uid,
        strategy_id: data.strategy_id,
        trader_id: data.trader_id,
    };
    let res = await_compat!(db.save_assignment(assign))?;
    return Ok(Json(res).respond_to(&req).unwrap());
}

pub async fn delete_one((req, path): (HttpRequest<State>, Path<(String, String, String)>)) -> Result<impl Responder> {
    let (exch, pair, period) = path.into_inner();
    let db: Database = req.state().db.clone();
    let base = await_compat!(BaseTemplateInfo::from_request(&req))?;
    require_login!(base);
    let assign = Assignment {
        exchange: exch,
        pair: pair,
        period: period,
        user_id: base.auth.uid,
        strategy_id: 0,
        trader_id: None,
    };
    await_compat!(db.delete_assignment(assign))?;
    return Ok(HttpResponse::new(http::StatusCode::OK));
}

pub fn configure(application: App<State>) -> App<State> {
    application
        .resource("/api/pairs", |r| {
            r.method(Method::GET).with(compat(pairs));
        })
        .resource("/api/periods", |r| {
            r.method(Method::GET).with(compat(periods));
        })
        .resource("/api/assignments/{exch}/{pair}/{period}", |r| {
            r.method(Method::POST).with(compat(post_one));
            r.method(Method::DELETE).with(compat(delete_one));
        })
        .resource("/api/assignments", |r| {
            r.method(Method::GET).with(compat(api_list));
            r.method(Method::POST).with(compat(api_post));
        })
}

