#![allow(unused_variables)]
use crate::prelude::*;

pub mod prelude;
pub mod lua;

pub struct StrategyInput {
    pub ohlc: BTreeMap<i64, Ohlc>,

}

pub trait TradingStrategy {
    fn decide(&self, data: &StrategyInput) -> Result<TradingPosition, EvalError>;
}


pub fn eval(ohlc : BTreeMap<i64,Ohlc>, strat : String) -> Result<TradingPosition, EvalError> {
    let strat = lua::LuaStrategy::new(&strat).map_err(|e| EvalError::InvalidStrategy(e.to_string()))?;
    let input = StrategyInput {
        ohlc
    };

    strat.decide(&input)
}