use crate::prelude::*;
use crate::ingest::OhlcUpdate;

use radix_trie::Trie;
use crate::eval::EvalRequest;
use std::time::Duration;
use futures_util::FutureExt;
use chrono::NaiveDateTime;

#[derive(Debug, Serialize, Deserialize)]
pub struct TradingRequestSpec {
    pub ohlc: OhlcSpec,
    pub user_id: i32,
    pub strat_id: i32,
    pub trader: Option<db::Trader>,
}

impl TradingRequestSpec {
    pub fn from_db(d: &db::Assignment, t: Option<db::Trader>) -> Self {
        TradingRequestSpec {
            ohlc: OhlcSpec::new(d.exchange.clone(), TradePair::from_str(&d.pair).unwrap(), OhlcPeriod::from_str(&d.period).unwrap()),
            user_id: d.owner_id,
            strat_id: d.strategy_id,
            trader: t,
        }
    }
    pub fn search_prefix(&self) -> String {
        return format!("/{}/{}/{:?}", self.ohlc.exchange(), self.ohlc.pair(), self.ohlc.period());
    }
}

pub struct Decider {
    handle: ContextHandle,
    db: Database,
    requests: Trie<String, TradingRequestSpec>,
    eval_svc: ServiceConnection<crate::eval::EvalService>,
    pos_svc: ServiceConnection<crate::trader::PositionService>,
}

impl Decider {
    pub fn new(handle: ContextHandle, db: db::Database, input: Addr<Proxy<OhlcUpdate>>) -> BoxFuture<Addr<Self>, failure::Error> {
        let eval = ServiceConnection::new(handle.clone());
        let pos = ServiceConnection::new(handle.clone());

        let fut = Future::join(eval, pos);

        box fut.map(|(eval_svc, pos_svc)| {
            Arbiter::start(move |ctx: &mut Context<Self>| {
                input.do_send(Subscribe::forever(ctx.address().recipient()));
                ctx.run_interval(Duration::from_secs(5), |this, ctx| {
                    this.reload(ctx);
                });
                Decider {
                    handle,
                    db,
                    eval_svc,
                    pos_svc,
                    requests: Trie::new(),
                }
            })
        }).from_err()
    }

    pub fn reload(&mut self, ctx: &mut Context<Self>) {
        let f = wrap_future(self.db.all_assignments_with_traders())
            .and_then(|req, this: &mut Self, ctx| {
                info!("Eval requests reloaded");
                this.requests = Trie::new();
                for (r, t) in req.iter() {
                    let spec = TradingRequestSpec::from_db(r, t.clone());
                    this.requests.insert(spec.search_prefix(), spec);
                }
                afut::ok(())
            });

        ctx.spawn(f.map(|_, _, _| ()).drop_err());
    }
}

impl Actor for Decider { type Context = Context<Self>; }

impl Handler<OhlcUpdate> for Decider {
    type Result = ();

    fn handle(&mut self, msg: OhlcUpdate, ctx: &mut Self::Context) -> Self::Result {
        if !msg.stable {
            return ();
        }
        use radix_trie::TrieCommon;
        let sub = self.requests.subtrie(&msg.search_prefix());
        if let Some(sub) = sub {
            for spec in sub.values() {
                let spec: &TradingRequestSpec = spec;
                info!("Should eval {:?} on {:?}", spec, msg.spec);
                let req = EvalRequest {
                    strat_id: spec.strat_id,
                    spec: spec.ohlc.clone(),
                    last: msg.ohlc.time,
                };
                let strategy_id = spec.strat_id;
                let owner_id = spec.user_id;
                let pair_id = spec.ohlc.pair_id().clone();

                let exchange = spec.ohlc.exchange().to_string();
                let trader = spec.trader.clone();

                let pair = spec.ohlc.pair().clone().to_string();
                let period = spec.ohlc.period().to_string();
                let fut = wrap_future(self.eval_svc.send(req));

                let fut = fut.and_then(move |res, this: &mut Self, ctx| {
                    info!("Evaluated to {:?}", res);

                    let (ok, error) = match res {
                        Ok(ref decision) => {
                            if let Some(trader) = trader {
                                let pos = crate::trader::PositionRequest {
                                    trader_id: trader,
                                    pair: pair_id,
                                    position: *decision,
                                };
                                let sent = this.pos_svc.send(pos);
                                let sent = sent.map(|r| {
                                    warn!("Trade resulted in : {:?}", r);
                                    ()
                                });

                                ctx.spawn(wrap_future(sent).drop_err());
                            }

                            (Some(decision.to_string()), None)
                        }
                        Err(ref e) => {
                            (None, Some(e.to_string()))
                        }
                    };

                    let evaluation = db::Evaluation {
                        strategy_id,
                        exchange,
                        pair,
                        period,
                        owner_id,
                        status: res.is_ok(),
                        time: common::chrono::Utc::now().naive_utc(),
                        ok,
                        error,
                    };

                    let f = wrap_future(this.db.log_eval(evaluation).drop_item().set_err(RemoteError::MailboxClosed));


                    f
                });

                ctx.spawn(fut.drop_err());
            }
        }
    }
}