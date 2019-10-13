use crate::prelude::*;


pub use strat_eval::EvalError;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EvalRequest {
    pub strat_id: i32,
    pub spec: OhlcSpec,
    pub last: i64,
}

impl Message for EvalRequest { type Result = Result<TradingPosition, EvalError>; }

impl EvalRequest {
    pub fn new(strat_id: i32, spec: impl Into<OhlcSpec>, last: i64) -> Self {
        EvalRequest {
            strat_id,
            spec: spec.into(),
            last,
        }
    }
}

pub struct Evaluator {
    client: anats::Client,
    db: Database,
}

impl Actor for Evaluator {}

impl Evaluator {
    pub fn new(client: anats::Client, db: Database) -> Addr<Self> {
        Self::start_async(|addr| async move {
            client.subscribe(crate::CHANNEL_EVAL_REQUESTS, crate::GROUP_EVAL_WORKERS.to_string(), addr.recipient()).await;
            Evaluator {
                client,
                db,
            }
        })
    }
}

impl Handler<EvalRequest> for Evaluator {
    type Future = impl Future<Output=Result<TradingPosition, EvalError>>;

    #[ak::suspend]
    fn handle(mut self: ContextRef<Self>, msg: EvalRequest) -> Self::Future {
        async move {
            let strat = self.db.single_strategy(msg.strat_id).await.unwrap();

            // Thousand ohlc candles ought to be enough for everyone
            let data = self.db
                .ohlc_history_backfilled(msg.spec.clone(), msg.last - (msg.spec.period().seconds() * 1000))
                .await.unwrap();
            //.timeout(std::time::Duration::from_secs(30));

            error!("Starting exec");
            let data = data.into_iter().map(|x| (x.time, x)).collect();

            error!("Starting Eval a");

            let (res, time) = measure_time(|| strat_eval::eval(data, strat.body));

            error!("Done Eval :{:?} in :{:?}", res, time);
            res
        }
    }
}
/*

impl Handler<EvalRequest> for Evaluator {
    type Result = Response<TradingPosition, EvalError>;

    fn handle(&mut self, req: EvalRequest, ctx: &mut Self::Context) -> Self::Result {
        let db = self.db.clone();
        Response::r#async(async move {
            let strat = db.single_strategy(req.strat_id).await.unwrap();

            // Thousand ohlc candles ought to be enough for everyone
            let data = db.ohlc_history_backfilled(req.spec.clone(), req.last - (req.spec.period().seconds() * 1000)).await.unwrap();
            //.timeout(std::time::Duration::from_secs(30));

            error!("Starting exec");
            let data = data.into_iter().map(|x| (x.time, x)).collect();

            error!("Starting Eval a");

            let (res, time) = measure_time(|| strat_eval::eval(data, strat.body));

            error!("Done Eval :{:?} in :{:?}", res, time);
            res
        }.boxed_local().compat())
    }
}

*/

