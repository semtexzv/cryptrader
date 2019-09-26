use crate::prelude::*;


pub use strat_eval::EvalError;
use actix::msgs::StopArbiter;

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

pub struct EvalWorker {
    client: anats::Client,
    db: Database,
}

impl Actor for EvalWorker {
    type Context = Context<Self>;
}

impl EvalWorker {
    pub fn new(client: anats::Client, db: Database) -> Addr<Self> {
        Actor::create(|ctx| {
            EvalWorker {
                client,
                db,
            }
        })
    }
}

impl Handler<EvalRequest> for EvalWorker {
    type Result = Response<TradingPosition, EvalError>;

    fn handle(&mut self, req: EvalRequest, ctx: &mut Self::Context) -> Self::Result {
        let strat = self.db.single_strategy(req.strat_id);

        // Thousand ohlc candles ought to be enough for everyone
        let data = self.db.ohlc_history_backfilled(req.spec.clone(), req.last - (req.spec.period().seconds() * 1000));
        //.timeout(std::time::Duration::from_secs(30));


        let fut = Future::join(strat, data);
        let fut = Future::then(fut, move |input| {
            let (strat, data) = input.unwrap();
            debug!("Starting exec");
            let data = data.into_iter().map(|x| (x.time, x)).collect();

            debug!("Starting Eval");

            let (res, time) = measure_time(|| strat_eval::eval(data, strat.body));

            debug!("Done Eval");
            future::result(res)
        });

        return Response::r#async(fut);
    }
}


