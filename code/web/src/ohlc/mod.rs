use crate::prelude::*;


use actix_web::Query;
use common::types::{TradePair, Ohlc, PairId, OhlcPeriod, Exchange};
use serde::de::Visitor;

#[derive(Debug, Deserialize)]
pub struct SinceQuery {
    since: i64
}

fn pair_from_str<'de, D>(data: D) -> Result<TradePair, D::Error>
    where
        D: Deserializer<'de>,
{
    use serde::de;
    struct V;
    impl<'a> Visitor<'a> for V {
        type Value = TradePair;
        fn expecting(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
            write!(formatter, "A tradepair string")
        }

        fn visit_str<E>(self, v: &str) -> Result<Self::Value, E> where E: de::Error, {
            Ok(TradePair::from_str(v).map_err(|e| de::Error::custom("TradePair format"))?)
        }
    }
    data.deserialize_str(V)
}

#[derive(Debug, Deserialize)]
pub struct PairStr(#[serde(deserialize_with = "pair_from_str")] TradePair);

pub async fn get_ohlc((req, path, since): (HttpRequest<State>, Path<(Exchange, PairStr, Option<OhlcPeriod>)>, Query<SinceQuery>)) -> Result<Json<Vec<Ohlc>>> {
    let (exch, pair, period) = path.into_inner();
    let pair = pair.0;
    let db = &req.state().db;
    let data = db.ohlc_history(PairId::new(exch, pair), since.into_inner().since).await.unwrap();

    let data = Ohlc::rescale(data.into_iter().map(|(_, v)| v), period.unwrap_or(OhlcPeriod::Min1));
    Ok(Json(data))
}

pub fn configure(app: App<State>) -> App<State> {
    app.resource("/api/ohlc/{exch}/{pair}/{period}", |r| {
        r.get().with(compat(get_ohlc))
    })
}