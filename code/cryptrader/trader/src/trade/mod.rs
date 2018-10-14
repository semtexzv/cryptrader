use prelude::*;

pub mod eval;
pub mod exec;


#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct MatcherDecision {
    pub pair: PairId,
    pub auth: AuthInfo,
    pub wallet: Wallet,
    pub ticker: Ticker,
    pub decision: TradingDecision,
}

pub struct StratMatcher {
    config: ::config::Config,
    context: zmq::Context,
    ohlc_sub: zmq::Socket,
    eval_svc: ServiceConn<eval::EvalSvcInfo>,
    decision_pub: zmq::Socket,
}

impl mq::AutoSimpleMultipart for MatcherDecision {}


impl StratMatcher {
    pub fn new(config: ::config::Config) -> Result<Self> {
        let mut context = ::common::ZMQ_CONTEXT.clone();

        let mut ohlc_sub = context.socket(zmq::SocketType::SUB)?;
        ohlc_sub.connect(mq::ENDPOINT_RESCALER_OUT)?;
        ohlc_sub.set_subscribe("".as_bytes())?;

        let mut decision_pub = context.socket(zmq::SocketType::PUB)?;
        decision_pub.bind(mq::ENDPOINT_DECISION_PUB)?;

        return Ok(StratMatcher {
            config,
            context,
            ohlc_sub,
            eval_svc: ServiceConn::new()?,
            decision_pub,
        });
    }

    pub fn run(mut self) -> Result<()> {
        loop {
            let mut poll: (bool, bool) = {
                let mut poll_items = [self.ohlc_sub.as_poll_item(zmq::POLLIN), self.eval_svc.as_poll_item(zmq::POLLIN)];
                let count = zmq::poll(&mut poll_items, -1)?;
                (poll_items[0].is_readable(), poll_items[1].is_readable())
            };

            if poll.0 {
                let mut msg: mq::Multipart = {
                    self.ohlc_sub.recv_mp()?
                };
                let mut update = svc_types::ohlc::OhlcUpdate::decode(&msg)?;
                let mut str = String::from_utf8_lossy(&msg[0]);

                let mut requests: Vec<eval::EvalQuery> = self.config.strategies.iter().filter(|&(name, strat)| {
                    strat.pattern.0.is_match(&str)
                }).map(|(name, info)| {
                    eval::EvalQuery {
                        strategy: name.clone(),
                        spec: update.spec.clone(),
                        auth: self.config.get_auth_for(&info.account, update.spec.exchange()).unwrap(),
                    }
                }).collect();

                for req in requests {
                    self.eval_svc.request(req)?;
                }
            }

            if poll.1 {
                let mut data = self.eval_svc.get()?;
                if let eval::EvalResp::Valid { req, wallet, ticker, decision } = data {
                    let mut msg = MatcherDecision {
                        pair: req.spec.pair_id().clone(),
                        auth: req.auth,
                        wallet: wallet,
                        decision: decision,
                        ticker: ticker,
                    };
                    self.decision_pub.send_mp(msg.encode()?)?;
                } else {
                    error!("Trader was unable to evaluate {:?}", data);
                }
            }
        }
    }
}
