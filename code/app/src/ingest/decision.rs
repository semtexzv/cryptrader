use crate::prelude::*;
use crate::ingest::OhlcUpdate;
use crate::eval::EvalRequest;

use radix_trie::Trie;
use std::time::Duration;
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
            user_id: d.user_id,
            strat_id: d.strategy_id,
            trader: t,
        }
    }
    pub fn search_prefix(&self) -> String {
        return format!("/{}/{}/{:?}", self.ohlc.exchange(), self.ohlc.pair(), self.ohlc.period());
    }
}

pub struct Decider {
    client: anats::Client,
    db: Database,
    requests: BTreeMap<String, Vec<TradingRequestSpec>>,
}

impl Decider {
    pub async fn new(client: anats::Client, db: db::Database) -> Result<Addr<Self>, failure::Error> {
        Ok(Actor::create(move |ctx: &mut Context<Self>| {
            client.subscribe(crate::CHANNEL_OHLC_RESCALED, None, ctx.address().recipient::<OhlcUpdate>());
            ctx.run_interval(Duration::from_secs(5), |this, ctx| {
                this.reload(ctx);
            });
            Decider {
                client,
                db,
                requests: BTreeMap::new(),
            }
        }))
    }

    pub fn reload(&mut self, ctx: &mut Context<Self>) {
        let f = wrap_future(self.db.all_assignments_with_traders())
            .and_then(|req, this: &mut Self, ctx| {
                info!("Eval requests reloaded");
                this.requests = BTreeMap::new();
                for (r, t) in req.iter() {
                    let spec = TradingRequestSpec::from_db(r, t.clone());

                    let strats = this.requests.entry(spec.search_prefix()).or_insert(Vec::new());
                    strats.push(spec);
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
        let sub = self.requests.get(&msg.search_prefix());
        if let Some(sub) = sub {
            for spec in sub.iter() {
                let msg = msg.clone();
                let spec: &TradingRequestSpec = spec;

                info!("Should eval {:?} on {:?}", spec, msg.clone().spec);

                let req = EvalRequest::new(spec.strat_id, spec.ohlc.clone(), msg.ohlc.time);

                let strategy_id = spec.strat_id;
                let user_id = spec.user_id;
                let pair_id = spec.ohlc.pair_id().clone();

                let exchange = spec.ohlc.exchange().to_string();
                let trader = spec.trader.clone();

                let pair = spec.ohlc.pair().clone().to_string();
                let period = spec.ohlc.period().to_string();

                let eval = self.client.request(crate::CHANNEL_EVAL_REQUESTS, req);

                let fut = wrap_future(eval);

                let fut = fut.and_then(move |res, this: &mut Self, ctx| {
                    info!("Evaluated to {:?}", res);
                    afut::ok(())
                    /*
                    let (ok, error) = match res {
                        Ok(ref decision) => {
                            if let Some(trader) = trader {
                                info!("Trader available, sending trade request");
                                let pos = crate::trader::PositionRequest {
                                    trader_id: trader,
                                    pair: pair_id,
                                    price_approx: msg.clone().ohlc.close,
                                    position: *decision,
                                };
                                let sent = this.pos_svc.send(pos);
                                let sent = sent.map(move |r| {
                                    warn!("Trade resulted in : {:?}", r);
                                    ()
                                });

                                ctx.spawn(wrap_future(sent).drop_err());
                            } else {
                                info!("Trader unavailable")
                            }

                            (Some(decision.to_string()), None)
                        }
                        Err(ref e) => {
                            (None, Some(e.to_string()))
                        }
                    };

                    let t2 = Instant::now();

                    let evaluation = db::Evaluation {
                        id: Uuid::new_v4(),
                        strategy_id,
                        exchange,
                        pair,
                        period,
                        user_id,
                        status: res.is_ok(),
                        time: common::chrono::Utc::now(),
                        ok,
                        error,
                        duration: t2.duration_since(t1).as_millis() as _,
                    };

                    let log_fut = wrap_future(this.db.log_eval(evaluation).drop_item().set_err(RemoteError::MailboxClosed));


                    log_fut*/
                });

                ctx.spawn(fut.drop_err());
            }
        }
    }
}