use common::prelude::*;
use common::msgs::*;
use common::types::*;
use common::anats;
use db::Database;


pub struct Evaluator {
    client: anats::Client,
    db: Database,
}

impl Actor for Evaluator {
    type Context = Context<Self>;
}

impl Evaluator {
    pub async fn new(client: anats::Client, db: Database) -> Addr<Self> {
        Actor::create(|ctx| {
            client.subscribe(common::CHANNEL_EVAL_REQUESTS, common::GROUP_EVAL_WORKERS.to_string(), ctx.address().recipient());
            Evaluator {
                client,
                db,
            }
        })
    }
}

impl Handler<EvalRequest> for Evaluator {
    type Result = Response<TradingPosition, EvalError>;

    fn handle(&mut self, req: EvalRequest, _ctx: &mut Self::Context) -> Self::Result {
        let db = self.db.clone();
        Response::r#async(async move {
            let strat = db.single_strategy(req.strat_id).await.unwrap();

            let since = req.last - (req.period.seconds() * 1000);
            // Thousand ohlc candles ought to be enough for everyone
            let data = db.ohlc_history_backfilled(req.pair_id, req.period, since).await.unwrap();
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


