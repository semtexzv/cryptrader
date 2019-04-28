use crate::prelude::*;

use crate::actix_arch::balancing::*;
use actix_arch::balancing::WorkerRequest;
pub use strat_eval::EvalError;
use actix_arch::balancing::WorkerProxy;
use actix::msgs::StopArbiter;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EvalRequest {
    pub strat_id: i32,
    #[cfg(feature = "measure")]
    pub eval_id: Uuid,
    pub spec: OhlcSpec,
    pub last: i64,
}


#[derive(Debug)]
pub struct EvalService;

impl ServiceInfo for EvalService {
    type RequestType = EvalRequest;
    type ResponseType = Result<TradingPosition, EvalError>;
    const ENDPOINT: &'static str = "actix://eval:42042/";
}


pub struct EvalWorker {
    db: Database,
    proxy: Option<Addr<WorkerProxy<EvalService>>>,
}

impl Actor for EvalWorker {
    type Context = Context<Self>;

    fn stopping(&mut self, ctx: &mut Self::Context) -> Running {
        if let Some(proxy) = self.proxy.clone() {
            // TODO: Send stop message
        }
        return Running::Stop;
    }
}

impl EvalWorker {
    pub fn new(handle: ContextHandle, db: Database) -> Addr<Self> {
        Actor::create(|ctx| {
            Self::init(ctx, handle, db)
        })
    }

    pub fn init(ctx: &mut Context<Self>, handle: ContextHandle, db: Database) -> Self {
        ctx.spawn(wrap_future(WorkerProxy::new(handle.clone(), ctx.address().recipient()))
            .then(|res, mut this: &mut Self, ctx| {
                this.proxy = Some(res.unwrap());
                afut::ok(())
            })
        );
        Self {
            db,
            proxy: None,
        }
    }
}

impl Handler<ServiceRequest<EvalService>> for EvalWorker {
    type Result = Response<Result<TradingPosition, EvalError>, RemoteError>;

    fn handle(&mut self, msg: ServiceRequest<EvalService>, ctx: &mut Self::Context) -> Self::Result {
        let req: EvalRequest = msg.0;

        let strat = self.db.single_strategy(req.strat_id);

        if cfg!(feature = "measure") {
            log_measurement(MeasureInfo::EvalReceived {
                eval_id: req.eval_id
            });
        }
        let t1 = Instant::now();

        // Thousand ohlc candles ought to be enough for everyone
        let data = self.db.ohlc_history_backfilled(req.spec.clone(), req.last - (req.spec.period().seconds() * 1000));
        //.timeout(std::time::Duration::from_secs(30));


        let fut = Future::join(strat, data);
        let fut = Future::map(fut, move |(strat, data)| {
            debug!("Starting exec");
            let data = data.into_iter().map(|x| (x.time, x)).collect();

            if cfg!(feature = "measure") {
                log_measurement(MeasureInfo::EvalDataLookup {
                    eval_id: req.eval_id,
                    lookup_duration: Instant::now().duration_since(t1),
                });
            }

            debug!("Starting Eval");

            let (res, time) = measure_time(|| strat_eval::eval(data, strat.body));

            if cfg!(feature = "measure") {
                log_measurement(MeasureInfo::EvalExecute {
                    eval_id: req.eval_id,
                    eval_duration: Duration::from_millis(time as _),
                });
            }
            debug!("Done Eval");
            Ok(res?)
        });

        return Response::r#async(fut.unwrap_err().set_err(RemoteError::Timeout));
    }
}


