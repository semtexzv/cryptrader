use ::prelude::*;

pub mod bitfinex;
pub mod backtest;

pub enum MsgFromServ {
    NewCandle,
}

#[derive(PartialOrd, PartialEq, Eq, Ord)]
pub enum ExchangeEvent {
    PairCandleUpdated(TradePair),
    TradingEndedTest,
}

pub trait Exchange {
    fn register_trading_pair(&mut self, pair: &TradePair, interval: &OhlcPeriod) -> Result<()>;

    fn bid(&self, curr: &TradePair) -> f64;
    fn ask(&self, curr: &TradePair) -> f64;

    fn available_to_sell(&self, curr: &TradePair) -> f64;
    fn available_to_buy(&self, curr: &TradePair) -> f64;


    fn sell(&mut self, amount: f64, curr: &TradePair) -> Result<()>;
    fn buy(&mut self, amount: f64, curr: &TradePair) -> Result<()>;

    fn poll(&mut self) -> Result<BTreeSet<ExchangeEvent>>;
    fn candles(&self, curr: &TradePair) -> BTreeMap<u64, Ohlc>;
}

pub trait RealExchange: Exchange {}

pub trait FakeExchange: Exchange {}

