use prelude::*;




use wsock::*;

use apis::bitfinex::*;
use apis::bitfinex as api;

use apis::bitfinex::candles::*;

#[derive(Debug, Clone, Default)]
pub struct PairData {
    ticker_chan_id: i32,
    candle_chan_id: i32,
    candle_interval: OhlcPeriod,
    last_ticker: Option<TickerData>,
    candles: BTreeMap<u64, Ohlc>,
}

pub struct Bitfinex {
    cl: WsClient,
    pairs: BTreeMap<TradePair, PairData>,
    wallets: BTreeMap<String, wallets::WalletInfo>,
}

impl Bitfinex {
    pub fn new() -> Result<Bitfinex> {
        let mut key = "KPlX4QCvrbjeNSGW9Nqcq2C2OId0qFiKU3zefqjEykN";
        let mut secret = "LPuWgmx3WEOYwzNIhQbeKhbja37NC1snF9fexiElKib";

        let mut url = "wss://api.bitfinex.com/ws/2";
        let cl = WsClient::connect(url)?;

        let auth = move || { auth::Auth::new(key.into(), secret.into()) };

        cl.tx.send(json::to_string(&auth())?)?;
        // Repeatedly try to sign in
        let signed = loop {
            match cl.rx.recv()? {
                Event::Msg(msg) => {
                    println!("msg: {}", msg);

                    if let Ok(r) = json::from_str::<Resp>(&msg) {
                        match r.data {
                            RespData::Auth(a) => {
                                if a.status == "OK" {
                                    break true;
                                } else {
                                    ::std::thread::sleep(::std::time::Duration::from_secs(1));
                                    cl.tx.send(json::to_string(&auth())?)?;
                                }
                            }
                            _ => {}
                        }
                    }
                }
                _ => {}
            }
        };


        return Ok(Bitfinex {
            cl,
            pairs: BTreeMap::new(),
            wallets: BTreeMap::new(),
        });
    }
    fn register_for_ticker(&mut self, curr: &TradePair) {
        let sub = Sub {
            event: "subscribe".into(),
            channel: "ticker".into(),
            symbol: curr.exchange_sym(),
        };

        self.cl.tx.send(json::to_string(&sub).unwrap()).unwrap();

        let data = PairData {
            ..Default::default()
        };

        self.pairs.entry(curr.clone()).or_insert(data);
    }

    fn register_for_candles(&mut self, cur: &TradePair, interval: &OhlcPeriod) {
        let sym = cur.exchange_sym();

        let s = json!({
                "event" : "subscribe",
                "channel" : "candles",
                "key" : format!("trade:{}:{}", interval.bfx_str() ,sym),

            });
        self.cl.tx.send(json::to_string(&s).unwrap()).unwrap();

        let data = PairData {
            ..Default::default()
        };

        let mut data = self.pairs.entry(cur.clone()).or_insert(data);
        data.candle_interval = interval.clone();
    }

    fn wallet_for_cur(&self, cur: &str) -> Result<wallets::WalletInfo> {
        match self.wallets.get(cur) {
            Some(w) => { return Ok(w.clone()); }
            _ => {
                return Ok(wallets::WalletInfo {
                    typ : "exchange".into(),
                    currency : cur.into(),
                    available : None,
                    balance : 0.0,
                    interest : 0.0
                });
            }
        }
    }
}


pub const PERIOD_MILLIS: i64 = 15 * 60 * 1000;
pub const PERIOD: &str = "15m";


impl Exchange for Bitfinex {

    fn register_trading_pair(&mut self, pair: &TradePair, interval : &OhlcPeriod) -> Result<()> {
        self.register_for_ticker(pair);
        self.register_for_candles(pair,interval);
        Ok(())
    }



    fn bid(&self, pair: &TradePair) -> f64 {
        let mut data = self.pairs.get(&pair).clone().unwrap();
        return data.last_ticker.as_ref().unwrap().bid;
    }

    fn ask(&self, pair: &TradePair) -> f64 {
        let mut data = self.pairs.get(&pair).clone().unwrap();
        return data.last_ticker.as_ref().unwrap().ask;
    }

    fn available_to_sell(&self, pair: &TradePair) -> f64 {
        let mut wallet_tar = self.wallet_for_cur(&pair.0).unwrap();
        let mut wallet_src = self.wallet_for_cur(&pair.1).unwrap();

        let available = wallet_tar.balance * 0.98;
        return available;
    }
    // TODO: Replace last price with bid/ask

    fn available_to_buy(&self, pair: &TradePair) -> f64 {
        let mut data = self.pairs.get(&pair).clone().unwrap();
        let mut wallet_tar = self.wallet_for_cur(&pair.0).unwrap();
        let mut wallet_src = self.wallet_for_cur(&pair.1).unwrap();

        let available = (wallet_src.balance / data.last_ticker.as_ref().unwrap().last_price) * 0.99;
        return available;
    }

    fn buy(&mut self, amount: f64, pair: &TradePair) -> Result<()> {
        println!("BUYING : {} of {:?}", amount, pair);
        let mut data = self.pairs.get(&pair).clone().unwrap();
        let mut wallet_tar = self.wallet_for_cur(&pair.0)?;
        let mut wallet_src = self.wallet_for_cur(&pair.1)?;

        let available = (wallet_src.balance / data.last_ticker.as_ref().unwrap().last_price) * 0.99;

        if available < amount {
            bail!("Not enough funds")
        }

        let order = order::NewOrder {
            typ: order::OrderType::ExchMarket,
            gid: None,

            symbol: pair.exchange_sym(),
            cid: api::nonce(),
            amount: format!("{}", amount),
            hidden: 0,
            postonly: 0,
            price: None,
            price_aux_limit: None,
            price_trailing: None,
        };

        let msg : api::order::NewOrderMsg = order.into();
        self.cl.tx.send(json::to_string(&msg)?)?;

        Ok(())
    }

    fn sell(&mut self, amount: f64, pair: &TradePair) -> Result<()> {
        println!("SELLING : {} of {:?}", amount, pair);
        let mut data = self.pairs.get(&pair).clone().unwrap();
        let mut wallet_tar = self.wallet_for_cur(&pair.0)?;
        let mut wallet_src = self.wallet_for_cur(&pair.1)?;

        let available = wallet_tar.balance * 0.99;

        if available < amount {
            bail!("Not enough funds")
        }

        let order = order::NewOrder {
            typ: order::OrderType::ExchMarket,
            gid: None,

            symbol: pair.exchange_sym(),
            cid: api::nonce(),
            amount: format!("{}", -amount),
            hidden: 0,
            postonly: 0,
            price: None,
            price_aux_limit: None,
            price_trailing: None,
        };

        let msg : api::order::NewOrderMsg = order.into();
        self.cl.tx.send(json::to_string(&msg)?)?;

        Ok(())
    }
    fn poll(&mut self) -> Result<BTreeSet<ExchangeEvent>> {

        let mut res = BTreeSet::new();
        while let Ok(::wsock::Event::Msg(str)) = self.cl.rx.try_recv() {
            println!("Recv : {}", str);
            if let Ok(r) = json::from_str::<Resp>(&str) {
                match r.data {
                    RespData::Sub(s) => {
                        if s.channel == "ticker" {
                            let pair = TradePair::from_sym(&s.symbol.unwrap());
                            let mut data = self.pairs.get_mut(&pair).unwrap();

                            data.ticker_chan_id = r.chan_id;
                        } else if s.channel == "candles" {
                            let spec = api::candles::CandleSpec::from_str(&s.key.unwrap()).unwrap();

                            let interval = super::OhlcPeriod::from_bfx(&spec.interval_str()).unwrap();

                            let pair = TradePair::from_sym(&spec.sym_str());

                            let mut data = self.pairs.get_mut(&pair).unwrap();

                            data.candle_chan_id = r.chan_id;
                        }
                    }
                    _ => {}
                }
            }
            if let Ok(msg) = json::from_str::<Msg>(&str) {
                match msg {
                    Msg(0, ref tag, _) if tag == "hb" => {
                        //println!("STATE : {:#?}", self.pairs);
                        //println!("STATE : {:#?}", self.wallets);
                    }
                    Msg(id, ref t, ref val) if t != "hb" && id != 0 => {
                        for (k, ref mut pair) in self.pairs.iter_mut() {
                            if pair.ticker_chan_id == id {
                                if let Ok(ticker) = json::from_value(val.clone()) {
                                    pair.last_ticker = Some(ticker);
                                }
                            } else if pair.candle_chan_id == id {
                                if let Ok(snap) = json::from_value::<Vec<BfxCandle>>(val.clone()) {
                                    for c in snap {
                                        let c: Ohlc = c.into();
                                        pair.candles.insert(c.time, c.clone());
                                    }
                                }
                                if let Ok(candle) = json::from_value::<api::candles::BfxCandle>(val.clone()) {
                                    let c: Ohlc = candle.into();
                                    pair.candles.insert(c.time, c.clone());
                                }
                                res.insert(ExchangeEvent::PairCandleUpdated(k.clone()));
                            }
                        }
                    }
                    Msg(id, ref t, ref val) if t == "ws" => {
                        println!("WALLET SNAPSHOT");
                        let mut wallets = json::from_value::<Vec<api::wallets::WalletInfo>>(val.clone()).unwrap();
                        for w in wallets {
                            if w.typ == "exchange" {
                                let c = w.currency.clone();
                                self.wallets.insert(c.clone(), w);
                            }
                        }
                    }
                    Msg(id, ref t, ref val) if t == "wu" => {
                        println!("WALLET UPDATE");
                        let mut w = json::from_value::<api::wallets::WalletInfo>(val.clone()).unwrap();
                        if w.typ == "exchange" {
                            let c = w.currency.clone();
                            self.wallets.insert(c.clone(), w);
                        }
                    }
                    _ => {}
                }
            }
        }

        if res.is_empty() {
            ::std::thread::sleep(::std::time::Duration::from_millis(20));
        }


        Ok(res)
    }

    fn candles(&self, curr: &TradePair) -> BTreeMap<u64,Ohlc> {
        let data = self.pairs.get(&curr);
        if let Some(data) = data {
            return data.candles.clone();
        } else {
            return BTreeMap::new();
        }
    }
}
