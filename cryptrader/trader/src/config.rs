use ::prelude::*;
use common::types::auth::AuthInfo;

#[derive(Debug, Clone)]
pub struct StratPattern(pub Regex);

impl<'de> Deserialize<'de> for StratPattern {
    fn deserialize<D>(deserializer: D) -> StdResult<Self, D::Error> where
        D: Deserializer<'de> {
        use serde::de::Error;
        let mut res: String = <String as Deserialize>::deserialize(deserializer)?
            .replace("/", r"/")
            .replace("*", r"[^/]*");

        //println!("Regex: {}", res);
        let mut reg = Regex::new(&format!("^{}", res)).unwrap();//.map_err(|x| D::Error::custom("Invalid pattern"))?
        return Ok(StratPattern(reg));
    }
}

#[derive(Debug, Clone, Deserialize)]
pub struct StratInfo {
    pub pattern: StratPattern,
    pub account: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct Accounts {
    pub name: String,
    exchanges: BTreeMap<String, AuthInfo>,
}


#[derive(Debug, Clone, Deserialize)]
pub struct Config {
    pub accounts: Vec<Accounts>,
    pub strategies: BTreeMap<String, StratInfo>,
}

impl Config {
    pub fn get_auth_for(&self, name: &str, exchange: &str) -> Option<AuthInfo> {
        self.accounts.iter().find(|x| x.name == name)
            .and_then(|x| x.exchanges.get(exchange))
            .map(clone)
    }
}

#[test]
fn test_config_patterns() {
    let mut str = format!("[{},{}]", r#"/*/*/15m"#, r#"/binance/BTCUSD/*m"#);
    let mut patterns: Vec<StratPattern> = yaml::from_str(&str).unwrap();

    assert!(patterns[0].0.is_match("/xxx/BTCUSD/15m"));
    assert!(patterns[1].0.is_match("/binance/BTCUSD/15m"));
    assert!(patterns[1].0.is_match("/binance/BTCUSD/1m"));
    assert!(!patterns[1].0.is_match("/binance/BTCUSD/1H"));
    assert!(!patterns[1].0.is_match("/bittrex/BTCUSD/1H"));
}