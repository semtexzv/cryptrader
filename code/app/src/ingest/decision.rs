use crate::prelude::*;
use crate::ingest::OhlcUpdate;

use radix_trie::Trie;
use crate::eval::EvalRequest;

#[derive(Debug, Serialize, Deserialize)]
pub struct TradingRequestSpec {
    pub ohlc: OhlcSpec,
    pub user_id: String,
    pub strat_id: i32,

}

impl TradingRequestSpec {
    pub fn from_db(d: &db::EvalRequest) -> Self {
        TradingRequestSpec {
            ohlc: OhlcSpec::new(d.exchange.clone(), TradePair::from_str(&d.pair).unwrap(), OhlcPeriod::from_bfx(&d.period).unwrap()),
            user_id: "".into(),
            strat_id: d.strategy_id,
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
}

impl Decider {
    pub fn new(handle: ContextHandle,db : db::Database, input: Addr<Proxy<OhlcUpdate>>) -> BoxFuture<Addr<Self>, failure::Error> {
        box ServiceConnection::new(handle.clone()).map(|eval_svc| {
            Arbiter::start(move |ctx : &mut Context<Self>| {
                input.do_send(Subscribe::forever(ctx.address().recipient()));
                Decider {
                    handle,
                    db,
                    eval_svc,
                    requests: Trie::new(),
                }
            })
        }).from_err()
    }

    pub fn reload(&mut self, ctx: &mut Context<Self>) {
        let f = wrap_future(self.db.eval_requests())
            .and_then(|req, this: &mut Self, ctx| {

                info!("Eval requests reloaded");
                this.requests = Trie::new();
                for r in req.iter() {
                    let spec = TradingRequestSpec::from_db(r);
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
        info!("Update received : {:?}",msg);
        use radix_trie::TrieCommon;
        let sub = self.requests.subtrie(&msg.search_prefix());
        if let Some(sub) = sub {
            for spec in sub.values() {
                let fut = wrap_future(self.eval_svc.send(unimplemented!()));

                ctx.spawn(fut.map(|_, _, _| ()).drop_err());
            }
        }
    }
}