use crate::prelude::*;
use crate::State;
use crate::utils::*;
use crate::users::middleware::UserAuthentication;
use std::string::ToString;
use actix_web::Path;
use common::types::{OhlcPeriod, Exchange, TradePair, PairId};
use db::{Database, Assignment};
use actix_web::Json;

pub async fn list(req: HttpRequest<State>) -> Result<impl Responder> {
    let db: Database = req.state().db.clone();
    let base = BaseReqInfo::from_request(&req).await?;
    require_login!(base);

    let pairs: Vec<db::Pair> = db.pairs().await?;
    let assignments: Vec<db::Assignment> = db.assignments(base.auth.uid).await?;
    let strategies: Vec<db::Strategy> = db.user_strategies(base.auth.uid).await?;

    Ok(Json(assignments).respond_to(&req)?)
}

#[derive(Default, Debug, Clone, Deserialize, Serialize)]
pub struct Assign {
    pub strategy_id: i32,
    pub trader_id: Option<i32>,
}

pub async fn post((req, path, data): (HttpRequest<State>, Path<(Exchange, String, OhlcPeriod)>, Json<Assign>)) -> Result<impl Responder> {
    let (exch, pair, period) = path.into_inner();
    let data = data.into_inner();

    let db: Database = req.state().db.clone();
    let base = BaseReqInfo::from_request(&req).await?;
    require_login!(base);
    let pair_id = PairId::new(exch, TradePair::from_str(&pair).unwrap());

    let assign = Assignment {
        pair_id : db.pair_id(pair_id).await?,
        period: period.to_string(),
        user_id: base.auth.uid,
        strategy_id: data.strategy_id,
        trader_id: data.trader_id,
    };

    let res = db.save_assignment(assign).await?;
    return Ok(Json(res).respond_to(&req).unwrap());

}

pub async fn delete((req, path): (HttpRequest<State>, Path<(Exchange, String, OhlcPeriod)>)) -> Result<impl Responder> {
    let (exch, pair, period) = path.into_inner();
    let db: Database = req.state().db.clone();
    let base = BaseReqInfo::from_request(&req).await?;
    require_login!(base);
    db.delete_assignment(PairId::new(exch, TradePair::from_str(&pair).unwrap()), base.auth.uid).await?;
    return Ok(HttpResponse::new(http::StatusCode::OK));
}

pub fn configure(application: App<State>) -> App<State> {
    application
        .resource("/api/assignments/{exch}/{pair}/{period}", |r| {
            r.method(Method::POST).with_async(compat(post));
            r.method(Method::DELETE).with_async(compat(delete));
        })
        .resource("/api/assignments", |r| {
            r.method(Method::GET).with_async(compat(list));
        })
}

