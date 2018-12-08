use ::prelude::*;
use common::arch::conn::*;
use services::{OhlcService, OhlcSvcInfo};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EvalQuery {
    pub strategy: String,
    pub auth: AuthInfo,
    pub spec: OhlcSpec,
}

impl mq::AutoSimpleMultipart for EvalQuery {}

impl arch::proxy::RoutableMsg for EvalQuery {
    fn rq_type(&self) -> &str {
        ""
    }
}

/*
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EvalResp {
    pub req: EvalQuery,
    pub wallet: Wallet,
    pub ticker: Ticker,
    pub decision: TradingDecision,
}
*/

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum EvalResp {
    Valid {
        req: EvalQuery,
        wallet: Wallet,
        ticker: Ticker,
        decision: TradingDecision,
    },
    Invalid,
}

impl mq::AutoSimpleMultipart for EvalResp {}

#[derive(Debug, Clone)]
pub struct EvalSvcInfo;

impl ProxyInfo for EvalSvcInfo {
    const WORKER_ENDPOINT: &'static str = mq::ENDPOINT_EVAL_WORKERS;
    const ENDPOINT: &'static str = mq::ENDPOINT_EVAL_SERVICE;
    type REQ = EvalQuery;
    type REP = EvalResp;
}

pub struct LiveStrategyEvaluator {
    worker: ServiceWorker<EvalSvcInfo>,
    ohlc_src: ServiceConn<OhlcSvcInfo>,
    ticker_src: ServiceConn<TickerSrcInfo>,
    wallet_src: ServiceConn<WalletSrcInfo>,

}

use common::mq::MultipartMsg;
use strategy::TradingStrategy;
use strategy::lua::LuaStrategy;

impl ::common::AppComponent for LiveStrategyEvaluator {
    fn new(ctx: zmq::Context) -> Result<Self> {
        //info!("Live evaluator starting up");

        return Ok(
            LiveStrategyEvaluator {
                worker: ServiceWorker::new(ctx)?,
                ohlc_src: ServiceConn::new()?,
                ticker_src: ServiceConn::new()?,
                wallet_src: ServiceConn::new()?,
            }
        );
    }

    fn run(mut self) -> Result<()> {
        loop {
            let work = self.worker.request()?;


            let end = work.spec.period().clamp_time(::common::unixtime() as u64);
            let start = end - work.spec.period().seconds() * 50;

            // Loading ohlc takes time, so load ohlc first and only then load other data
            self.ohlc_src.request(OhlcQuery {
                start,
                end,
                spec: work.spec.clone(),
            })?;

            let ohlc = self.ohlc_src.get()?;

            self.ticker_src.request(TickerQuery {
                pair: work.spec.pair_id().clone()
            })?;

            self.wallet_src.request(WalletQuery {
                pair: work.spec.pair_id().clone(),
                auth: work.auth.clone(),
            })?;


            let ticker = self.ticker_src.get()?;
            let wallet = self.wallet_src.get()?;

            if ticker.ticker.is_none() {
                self.worker.reply(EvalResp::Invalid)?;
                continue;
            }

            let mut input = ::strategy::StrategyInput {
                pair: ticker.query.pair,
                ticker: ticker.ticker.clone().unwrap(),
                candles: ohlc.ohlc.into_iter().map(|x| (x.time, x)).collect(),
                buy_available: 0.0,
                sell_available: 0.0,
            };
            let mut lua = LuaStrategy::from_file(&work.strategy)?;
            let decision = lua.decide(&input);

            let mut resp = EvalResp::Valid {
                req: work,
                decision,
                wallet: wallet.wallet,
                ticker: ticker.ticker.unwrap(),
            };
            // info!("Eval done: {:?}", resp);
            self.worker.reply(resp)?;
        }
    }
}