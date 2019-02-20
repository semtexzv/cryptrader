use crate::prelude::*;
use crate::ingest::OhlcUpdate;

use radix_trie::Trie;

#[derive(Debug, Serialize, Deserialize)]
pub struct TradingRequestSpec {
    pub ohlc: OhlcSpec,
    pub user_id: String,
    pub strat_id: String,
}

impl TradingRequestSpec {
    pub fn search_prefix(&self) -> String {
        return format!("/{}/{}/{:?}", self.ohlc.exchange(), self.ohlc.pair(), self.ohlc.period());
    }
}

pub struct Decider {
    handle: ContextHandle,
    requests: Trie<String, TradingRequestSpec>,
}

impl Decider {
    pub fn new(handle: ContextHandle, input: Addr<Proxy<OhlcUpdate>>) -> BoxFuture<Addr<Self>, failure::Error> {
        box future::ok(Actor::create(|ctx| {
            Decider {
                handle,
                requests: Trie::new(),
            }
        }))
    }
}

impl Actor for Decider { type Context = Context<Self>; }

impl Handler<OhlcUpdate> for Decider {
    type Result = ();

    fn handle(&mut self, msg: OhlcUpdate, ctx: &mut Self::Context) -> Self::Result {
        use radix_trie::TrieCommon;
        let sub = self.requests.subtrie(&msg.search_prefix());
        for spec in sub.unwrap().values() {
            unimplemented!()
        }
    }
}