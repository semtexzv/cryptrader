use prelude::*;

use common::arch::conn::ExchangeExecSrcInfo;

pub struct StratExecutor {
    ctx: zmq::Context,
    recv_sock: zmq::Socket,
    exec_svc: ServiceConn<ExchangeExecSrcInfo>,
}

impl AppComponent for StratExecutor {
    fn new(ctx: ::zmq::Context) -> Result<Self> {
        let mut recv_sock = ctx.socket(zmq::SocketType::SUB)?;
        recv_sock.connect(mq::ENDPOINT_DECISION_PUB)?;
        recv_sock.set_subscribe(b"")?;

        Ok(StratExecutor {
            ctx,
            recv_sock,
            exec_svc: ServiceConn::new()?,
        })
    }

    fn run(mut self) -> Result<()> {
        loop {
            let (recv, svc) = {
                let mut pollitems = [self.recv_sock.as_poll_item(zmq::POLLIN), self.exec_svc.as_poll_item(zmq::POLLIN)];

                zmq::poll(&mut pollitems, -1)?;
                (pollitems[0].is_readable(), pollitems[1].is_readable())
            };

            if recv {
                let msg = self.recv_sock.recv_mp()?;
                let data = super::MatcherDecision::decode(&msg)?;

                let src = data.wallet.src_available(data.pair.pair());
                let tar = data.wallet.tar_available(data.pair.pair());

                let bid = data.ticker.bid;
                let ask = data.ticker.ask;

                match data.decision {
                    TradingDecision::Long => {
                        if src > data.wallet.src_min(data.pair.pair()) {
                            let buy_amount = src / ask;
                            error!("Buying {:?} at {} of {:?} -- SRC:{:?}, TAR:{:?}", buy_amount, ask, data.pair, src, tar);

                            let query = ExchQuery::Order(OrderQuery {
                                auth: data.auth,
                                pair: data.pair,
                                amount: buy_amount,
                                price: ask,
                            });
                            self.exec_svc.request(query)?;
                        }
                    }
                    TradingDecision::Short => {
                        if tar > data.wallet.tar_min(data.pair.pair()) {
                            let sell_amount = tar;
                            error!("Selling {:?} at {} of {:?}-- SRC:{:?}, TAR:{:?}", sell_amount, bid, data.pair, src, tar);

                            let query = ExchQuery::Order(OrderQuery {
                                auth: data.auth,
                                pair: data.pair,
                                amount: sell_amount,
                                price: bid,
                            });
                            self.exec_svc.request(query)?;
                        }
                    }
                    TradingDecision::Indeterminate => {}
                }
            }
        }
    }
}