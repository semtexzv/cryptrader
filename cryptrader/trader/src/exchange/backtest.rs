use prelude::*;

use super::*;


#[derive(Debug)]
pub struct BackTestExchange {
    candles: BTreeMap<u64, Ohlc>,
    period: OhlcPeriod,
    current_time: u64,
    tar_balance: f64,
    src_balance: f64,
    pair: Option<TradePair>,
    start_valuation: f64,
    end_valuation: f64,
}

impl BackTestExchange {
    pub fn new() -> BackTestExchange {
        BackTestExchange {
            candles: BTreeMap::new(),
            period: OhlcPeriod::Min1,
            current_time: 0,
            tar_balance: 100.0,
            src_balance: 100.0,
            pair: None,
            start_valuation: 0.0,
            end_valuation: 0.0,
        }
    }

    pub fn valuation(&self) -> f64 {
        let tar_v = self.tar_balance * self.ask(self.pair.as_ref().unwrap());
        let tar_s = self.src_balance;
        return tar_v + tar_s;
    }
}

impl Exchange for BackTestExchange {
    fn register_trading_pair(&mut self, pair: &TradePair, interval: &OhlcPeriod) -> Result<()> {
        self.period = interval.clone();
        let candles = db::resampled_ohlc_values(&db::connect_store(), pair, interval);
        for c in candles {
            self.candles.insert(c.time, c);
        }
        if self.candles.is_empty() {
            bail!("Not enough test data");
        }
        self.current_time = self.candles.iter().next().unwrap().1.time + self.period.seconds();
        self.pair = Some(pair.clone());
        self.start_valuation = self.valuation();
        Ok(())
    }

    fn bid(&self, curr: &TradePair) -> f64 {
        let mut range = self.candles.range(self.current_time..);
        return range.next().or(self.candles.iter().next_back()).unwrap().1.open;
    }

    fn ask(&self, curr: &TradePair) -> f64 {
        let mut range = self.candles.range(self.current_time..);
        return range.next().or(self.candles.iter().next_back()).unwrap().1.open;
    }

    fn available_to_sell(&self, curr: &TradePair) -> f64 {
        return self.tar_balance;
    }

    fn available_to_buy(&self, curr: &TradePair) -> f64 {
        return self.src_balance / self.ask(curr);
    }

    fn sell(&mut self, amount: f64, curr: &TradePair) -> Result<()> {
        assert!(self.available_to_sell(curr) <= amount);
        println!("BEFORE BUY : TAR: {:?}, SRC: {:?}, value : {:?}", self.tar_balance, self.src_balance, self.valuation());
        self.tar_balance -= amount;
        self.src_balance += amount * self.bid(curr);
        println!("AFTER SELL : TAR: {:?}, SRC: {:?}, value : {:?}", self.tar_balance, self.src_balance, self.valuation());
        Ok(())
    }

    fn buy(&mut self, amount: f64, curr: &TradePair) -> Result<()> {
        assert!(self.available_to_buy(curr) <= amount);
        println!("Buy : bid {:?}, ask : {:?}",self.bid(curr),self.ask(curr));
        println!("BEFORE BUY : TAR: {:?}, SRC: {:?}, value : {:?}", self.tar_balance, self.src_balance, self.valuation());
        self.tar_balance += amount;
        self.src_balance -= amount * self.ask(curr);
        println!("AFTER BUY : TAR: {:?}, SRC: {:?}, value : {:?}", self.tar_balance, self.src_balance, self.valuation());
        Ok(())
    }

    fn poll(&mut self) -> Result<BTreeSet<ExchangeEvent>> {
        self.current_time += self.period.seconds();
        if self.current_time > self.candles.iter().next_back().unwrap().1.time {
            self.end_valuation = self.valuation();
            return Ok(btreeset! {  ExchangeEvent::TradingEndedTest });
        }
        return Ok(btreeset! { ExchangeEvent::PairCandleUpdated(self.pair.as_ref().unwrap().clone()) });
    }

    fn candles(&self, curr: &TradePair) -> BTreeMap<u64, Ohlc> {
        let mut res = btreemap!();
        for (k, c) in self.candles.range(0..self.current_time + 1) {
            res.insert(*k, c.clone());
        }
        return res;
    }
}