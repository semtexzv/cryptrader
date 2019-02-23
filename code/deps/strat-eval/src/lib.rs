use crate::prelude::*;

pub mod prelude;
pub mod lua;

#[derive(Debug,Fail,Serialize,Deserialize)]
pub enum EvalError {
    #[fail(display = "Missing strategy required data")]
    MissingData,
    #[fail(display = "Invalid strategy source code : {}", 0)]
    InvalidStrategy(String),
}

pub struct StrategyInput {
    pub ohlc: BTreeMap<i64, Ohlc>,

}

pub trait TradingStrategy {
    // Perform decision making.
    // return -100 - 100 meaning short - long
    fn decide(&self, data: &StrategyInput) -> TradingDecision;
}


pub fn eval(ohlc : BTreeMap<i64,Ohlc>, strat : String) -> Result<TradingDecision, EvalError> {
    let strat = lua::LuaStrategy::new(&strat).map_err(|e| EvalError::InvalidStrategy(e.to_string()))?;
    let input = StrategyInput {
        ohlc
    };
    let res = strat.decide(&input);
    Ok(res)
}