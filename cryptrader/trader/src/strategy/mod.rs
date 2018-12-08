use prelude::*;

pub mod lua;

pub struct StrategyInput {
    pub pair: PairId,
    pub ticker: Ticker,
    pub candles: BTreeMap<u64, Ohlc>,
    
    pub buy_available: f64,
    pub sell_available: f64,
}

pub trait TradingStrategy {
    // Perform decision making.
    // return -100 - 100 meaning short - long
    fn decide(&self, data: &StrategyInput) -> TradingDecision;
}

