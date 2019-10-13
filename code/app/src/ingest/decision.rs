use crate::prelude::*;
use crate::ingest::OhlcUpdate;
use crate::eval::EvalRequest;

use radix_trie::Trie;
use std::time::Duration;
use chrono::NaiveDateTime;
use common::msgs::PositionRequest;
use common::types::Exchange;


#[derive(Debug, Serialize, Deserialize)]
pub struct TradingRequestSpec {
    pub ohlc: OhlcSpec,
    pub user_id: i32,
    pub strat_id: i32,
    pub trader: Option<db::Trader>,
}

impl TradingRequestSpec {
    pub fn from_db(d: &db::Assignment, t: Option<db::Trader>) -> Self {
        unimplemented!()
        /*
        TradingRequestSpec {
            ohlc: OhlcSpec::new(Exchange::from_str(&d.exchange).unwrap(), TradePair::from_str(&d.pair).unwrap(), OhlcPeriod::from_str(&d.period).unwrap()),
            user_id: d.user_id,
            strat_id: d.strategy_id,
            trader: t,
        }
        */
    }
    pub fn search_prefix(&self) -> String {
        return format!("/{}/{}/{:?}", self.ohlc.exchange(), self.ohlc.pair(), self.ohlc.period());
    }
}

impl_invoke!(Decider);

pub struct Decider {
    client: anats::Client,
    db: Database,
    requests: BTreeMap<String, Vec<TradingRequestSpec>>,
}

impl Decider {
    pub async fn new(client: anats::Client, db: db::Database) -> Result<Addr<Self>, failure::Error> {
        Ok(Self::start(move |addr| {
            //client.subscribe(crate::CHANNEL_OHLC_RESCALED, None, ctx.address().recipient::<OhlcUpdate>());
            /*ctx.run_interval(Duration::from_secs(5), |this, ctx| {
                this.reload(ctx);
            });
            */
            Decider {
                client,
                db,
                requests: BTreeMap::new(),
            }
        }))
    }

    pub fn reload(&mut self, ctx: &mut Context<Self>) {
        /*let addr = ctx.address().clone();
        let fut = async {
            let db = addr.invoke(|this: &mut Self, ctx| {
                this.db.clone()
            }).await;

            let req = db.all_assignments_with_traders().await.unwrap();

            ActorExt::invoke(addr.clone(), move |this: &mut Self, ctx| {
                this.requests = BTreeMap::new();
                for (r, t) in req.iter() {
                    let spec = TradingRequestSpec::from_db(r, t.clone());

                    let strats = this.requests.entry(spec.search_prefix()).or_insert(Vec::new());
                    strats.push(spec);
                }
            }).await;

            Ok::<_, ()>(())
        };
        */
        //ctx.spawn(f.map(|_, _, _| ()).drop_err());
    }
}

impl Actor for Decider {  }

impl Handler<OhlcUpdate> for Decider {

    type Future = impl Future<Output=()> + 'static;

    fn handle(mut self : ContextRef<Self>, msg : OhlcUpdate) -> Self::Future {
        async {}
        /*
        if !msg.stable {
            return ();
        }
        use radix_trie::TrieCommon;
        let sub = self.requests.get(&msg.search_prefix());
        if let Some(sub) = sub {
            for spec in sub.iter() {
                let msg = msg.clone();
                let spec: &TradingRequestSpec = spec;

                error!("Should eval {:?} on {:?}", spec, msg.clone().spec);

                let req = EvalRequest::new(spec.strat_id, spec.ohlc.clone(), msg.ohlc.time);
                let t1 = Instant::now();

                let strategy_id = spec.strat_id;
                let user_id = spec.user_id;
                let pair_id = spec.ohlc.pair_id().clone();

                let exchange = spec.ohlc.exchange().to_string();
                let trader = spec.trader.clone();

                let pair = spec.ohlc.pair().clone().to_string();
                let period = spec.ohlc.period().to_string();

                let client = self.client.clone();
                let db = self.db.clone();
                let fut = async move {
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
            }
        }
        */
    }
}