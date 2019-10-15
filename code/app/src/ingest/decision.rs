use crate::prelude::*;

use std::time::Duration;
use chrono::NaiveDateTime;
use common::msgs::{EvalRequest, PositionRequest, OhlcUpdate};
use db::Evaluation;


use multimap::MultiMap;

#[derive(Debug, Serialize, Deserialize)]
pub struct AssignmentSpec {
    pub pair_id: i32,
    pub period: OhlcPeriod,

    pub user_id: i32,
    pub strat_id: i32,
    pub trader: Option<db::Trader>,
}

impl AssignmentSpec {
    pub fn from_db(d: &db::Assignment, t: Option<db::Trader>) -> Self {
        AssignmentSpec {
            pair_id: d.pair_id,
            period: OhlcPeriod::from_str(&d.period).unwrap(),
            user_id: d.user_id,
            strat_id: d.strategy_id,
            trader: t,
        }
    }
    pub fn search_prefix(&self) -> String {
        return format!("/{}/{:?}", self.pair_id, self.period);
    }
}

impl_invoke!(Decider);

pub struct Decider {
    client: anats::Client,
    db: Database,
    requests: MultiMap<OhlcSpec, AssignmentSpec>
}

impl Decider {
    pub async fn new(client: anats::Client, db: db::Database) -> Result<Addr<Self>, failure::Error> {
        Ok(Arbiter::start(move |ctx: &mut Context<Self>| {
            client.subscribe(crate::CHANNEL_OHLC_RESCALED, None, ctx.address().recipient::<OhlcUpdate>());

            ctx.run_interval(Duration::from_secs(5), |this, ctx| {
                this.reload(ctx);
            });
            Decider {
                client,
                db,
                requests: MultiMap::new(),
            }
        }))
    }

    pub fn reload(&mut self, ctx: &mut Context<Self>) {
        let addr = ctx.address().clone();


        let fut = wrap_future(self.db.all_assignments_with_traders().boxed_local().compat())
            .map(|res, this: &mut Self, ctx| {
                warn!("Eval requests reloaded : {:?}", res);
                this.requests = MultiMap::new();
                for (r, t) in res.iter() {
                    let spec = AssignmentSpec::from_db(r, t.clone());
                    let assign = wrap_future(self.db.pair_data(spec.pair_id).boxed_local().compat())
                        .map(move| pair, this : &mut Self, ctx| {
                            this.requests.insert(OhlcSpec::new(pair.exch().clone(), pair.pair(), spec.period), spec);
                        });

                    ctx.spawn(assign.map(|_, _, _| ()).drop_err());
                }
            });
        ctx.spawn(fut.map(|_, _, _| ()).drop_err());
    }
}

impl Actor for Decider { type Context = Context<Self>; }

#[derive(Debug)]
struct MakeEvalRequest(EvalRequest, Option<db::Trader>);

impl Message for MakeEvalRequest { type Result = (); }

impl Handler<OhlcUpdate> for Decider {
    type Result = ();

    fn handle(&mut self, msg: OhlcUpdate, ctx: &mut Self::Context) -> Self::Result {
        if !msg.stable {
            return ();
        }
        error!("Got rescaler update :{:?}", msg.spec);
        if let Some(reqs) = self.requests.get_vec(&msg.spec) {
            for spec in reqs.iter() {
                let msg = msg.clone();
                let spec: &AssignmentSpec = spec;

                error!("Should eval {:?} on {:?}", spec, msg.clone().spec);

                let req = EvalRequest::new(spec.strat_id, spec.pair_id, spec.period.clone(), msg.ohlc.time);
                ctx.address().do_send(MakeEvalRequest(req, spec.trader.clone()));
            }
        }
    }
}

impl Handler<MakeEvalRequest> for Decider {
    type Result = ();

    fn handle(&mut self, msg: MakeEvalRequest, ctx: &mut Self::Context) -> Self::Result {
        let req = msg.0;
        let trader = msg.1;

        let pair_id = req.pair_id;

        let pair = wrap_future::<_,Self>(self.db.pair_data(req.pair_id).boxed_local().compat());
        let eval_res = wrap_future::<_,Self>(self.client.request(common::CHANNEL_EVAL_REQUESTS, req));

        let fut = pair.drop_err().and_then(move |pair, this : &mut Self, ctx| {
            info!("Eval ?");
            eval_res.and_then(move |eval, this: &mut Self, ctx| {
                let (ok, error) = match eval {
                    Ok(ref decision) => {
                        if let Some(trader) = trader {
                            info!("Trader available, sending trade request");
                            let pos = PositionRequest::new(trader.api_key, trader.api_secret, pair.into(), *decision);
                            this.client.publish(crate::CHANNEL_POSITION_REQUESTS, pos);
                        } else {
                            info!("Trader unavailable")
                        }
                        (Some(decision.to_string()), None)
                    }
                    Err(e) => {
                        (None, Some(e.to_string()))
                    }
                };

                afut::ok(())
            }).drop_err()
        });

        ctx.spawn(fut);

        /*
        async move {
            let eval = client.request(crate::CHANNEL_EVAL_REQUESTS, req).compat().await.expect("Eval req");
            error!("Evaluated to {:?} bla", eval);

            let (ok, error) = match eval {
                Ok(ref decision) => {
                    if let Some(trader) = trader {
                        info!("Trader available, sending trade request");
                        let pos = PositionRequest::new(trader.exchange, trader.api_key, trader.api_secret, pair_id, msg.clone().ohlc.close, *decision);
                        let pos = client.request(crate::CHANNEL_POSITION_REQUESTS, pos).compat().await;
                        warn!("Trade resulted in : {:?}", pos);
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
                // TODO: pair_id
                pair_id: 0,
                period,
                user_id,
                status: eval.is_ok(),
                time: common::chrono::Utc::now(),
                ok,
                error,
                duration: t2.duration_since(t1).as_millis() as _,
            };

            db.log_eval(evaluation).await.expect("Logging evaluation");
            Ok(())
        };

        ctx.spawn(Box::new(fut.boxed_local().compat().into_actor(self)));
        */
    }
}