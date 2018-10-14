use ::prelude::*;

pub mod v1;
pub mod v2;

#[derive(Debug, Deserialize, Serialize)]
pub struct Res<T: Debug> {
    success: bool,
    message: String,
    pub result: Option<T>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct MarketInfo {
    #[serde(rename = "MarketCurrency")]
    pub tar_currency: String,
    #[serde(rename = "BaseCurrency")]
    pub src_currency: String,
    #[serde(rename = "MarketName")]
    pub market_name: String,
    #[serde(rename = "IsActive")]
    pub active: bool,
    #[serde(rename = "Created")]
    created: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct CurrencyInfo {
    #[serde(rename = "Currency")]
    name: String,
    #[serde(rename = "CyrrencyLong")]
    name_long: String,
    #[serde(rename = "TxFee")]
    tx_fee: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Ticker {
    #[serde(rename = "Bid")]
    bid: f64,
    #[serde(rename = "Ask")]
    ask: f64,
    #[serde(rename = "Last")]
    last: f64,
}


#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct MarketSummary {
    #[serde(rename = "MarketName")]
    pub name: String,
    #[serde(rename = "High")]
    pub high: f64,
    #[serde(rename = "Low")]
    pub low: f64,
    #[serde(rename = "Volume")]
    pub vol: f64,
    #[serde(rename = "Last")]
    pub last: f64,
    #[serde(rename = "TimeStamp")]
    pubtime: String,
    #[serde(rename = "Bid")]
    pub bid: f64,
    #[serde(rename = "Ask")]
    pub ask: f64,
    #[serde(rename = "OpenSellOrders")]
    pub sell_orders: i64,
    #[serde(rename = "OpenBuyOrders")]
    pub buy_orders: i64,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct MarketHistory {
    #[serde(rename = "Id")]
    id: i64,
    #[serde(rename = "TimeStamp")]
    time: String,
    #[serde(rename = "Quantity")]
    quant: f64,
    #[serde(rename = "Price")]
    price: f64,
    #[serde(rename = "Total")]
    total: f64,
    #[serde(rename = "FillType")]
    fill_type: String,
    #[serde(rename = "OrderType")]
    order_type: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NewOrder {
    #[serde(rename = "uuid")]
    uuid: String,
}


#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Balance {
    currency: String,
    balance: f64,
    available: f64,
    pending: f64,
    address: f64,
}

#[derive(Deserialize, Debug, Clone)]
pub struct BittrexOhlc {
    #[serde(rename = "O")]
    pub open: f64,
    #[serde(rename = "H")]
    pub high: f64,
    #[serde(rename = "L")]
    pub low: f64,
    #[serde(rename = "C")]
    pub close: f64,
    #[serde(rename = "V")]
    pub vol: f64,
    #[serde(rename = "BV")]
    pub buy_vol: f64,
    #[serde(rename = "T")]
    pub time: String,
}

impl Into<Ohlc> for BittrexOhlc {
    fn into(self) -> Ohlc {
        use common::chrono::TimeZone;
        let t = ::common::chrono::Utc.datetime_from_str(&self.time, "%FT%T").unwrap().timestamp();
        return Ohlc {
            open: self.open,
            high: self.high,
            low: self.low,
            close: self.close,
            vol: self.vol + self.buy_vol * self.close,
            time: t as u64,
        };
    }
}



pub fn markets() -> Result<Res<Vec<MarketInfo>>> {
    let client = Client::new();

    let resp = client.get("https://bittrex.com/api/v1.1/public/getmarkets").build()?;

    Ok(client.execute(resp)?.json()?)
}

pub fn market_summaries() -> Result<Vec<MarketSummary>> {
    let client = Client::new();
    let rq = client.get("https://bittrex.com/api/v1.1/public/getmarketsummaries").build()?;

    let res = client.execute(rq)?.json::<Res<Vec<MarketSummary>>>()?;
    return Ok(res.result.unwrap());
}

pub struct BittrexExchange {
    client: Client,
    api_key: String,
}

impl BittrexExchange {
    pub fn markets(&self) -> Result<Vec<MarketInfo>> {
        let rq = self.client.get("https://bittrex.com/api/v1.1/public/getmarkets").build()?;

        let res = self.client.execute(rq)?.json::<Res<Vec<MarketInfo>>>()?;
        return Ok(res.result.unwrap());
    }
    pub fn currencies(&self) -> Result<Vec<CurrencyInfo>> {
        let rq = self.client.get("https://bittrex.com/api/v1.1/public/getcurrencies").build()?;
        let res = self.client.execute(rq)?.json::<Res<Vec<CurrencyInfo>>>()?;

        return Ok(res.result.unwrap());
    }
    pub fn ticker(&self) -> Result<Ticker> {
        let rq = self.client.get("https://bittrex.com/api/v1.1/public/getticker").build()?;
        let res = self.client.execute(rq)?.json::<Res<Ticker>>()?;

        return Ok(res.result.unwrap());
    }

    pub fn market_summaries(&self) -> Result<Vec<MarketSummary>> {
        let rq = self.client.get("https://bittrex.com/api/v1.1/public/getmarketsummaries").build()?;

        let res = self.client.execute(rq)?.json::<Res<Vec<MarketSummary>>>()?;
        return Ok(res.result.unwrap());
    }
    pub fn market_summary(&self, name: String) -> Result<MarketSummary> {
        let url = format!("https://bittrex.com/api/v1.1/public/getmarketsummary?market={}", name);
        let rq = self.client.get(&url)
            .build()?;

        let res = self.client.execute(rq)?.json::<Res<MarketSummary>>()?;
        return Ok(res.result.unwrap());
    }
    pub fn market_history(&self, name: String) -> Result<MarketHistory> {
        let url = format!("https://bittrex.com/api/v1.1/public/getmarkethistory?market={}", name);
        let rq = self.client.get(&url)
            .build()?;


        let res = self.client.execute(rq)?.json::<Res<MarketHistory>>()?;

        return Ok(res.result.unwrap());
    }

    pub fn new_order_limit(&self, price: f64, amount: f64, market: String) -> Result<NewOrder> {
        let url = if amount < 0.0 {
            format!("https://bittrex.com/api/v1.1/market/selllimit?apikey={}&market={}&quantity={}&rate={}", self.api_key, market, price, amount)
        } else {
            format!("https://bittrex.com/api/v1.1/market/buylimit?apikey={}&market={}&quantity={}&rate={}", self.api_key, market, price, amount)
        };

        let rq = self.client.get(&url)
            .build()?;


        let res = self.client.execute(rq)?.json::<Res<NewOrder>>()?;

        return Ok(res.result.unwrap());
    }

    pub fn cancel_order(&self, uuid: String) -> Result<()> {
        let url = format!("https://bittrex.com/api/v1.1/market/cancel?apikey={}&uuid={}", self.api_key, uuid);
        let rq = self.client.get(&url)
            .build()?;


        let res = self.client.execute(rq)?.json::<Res<()>>()?;

        return Ok(res.result.unwrap());
    }

    pub fn balances(&self) -> Result<Vec<Balance>> {
        let url = format!("https://bittrex.com/api/v1.1/account/getbalances?apikey={}", self.api_key);

        let rq = self.client.get(&url).build()?;

        let res = self.client.execute(rq)?.json::<Res<Vec<Balance>>>()?;

        return Ok(res.result.unwrap());
    }

    pub fn balance(&self, market: String) -> Result<Balance> {
        let url = format!("https://bittrex.com/api/v1.1/account/getbalances?apikey={}&currency={}", self.api_key, market);

        let rq = self.client.get(&url).build()?;

        let res = self.client.execute(rq)?.json::<Res<Balance>>()?;

        return Ok(res.result.unwrap());
    }
}

#[derive(Deserialize)]
pub struct Negotiate {
    #[serde(rename = "ConnectionToken")]
    token: String,
    #[serde(rename = "ConnectionId")]
    id: String,
}

pub fn test_ws() -> Result<()> {
    let client = Client::new();
    let rq = client.get(r#"https://socket.bittrex.com/signalr/negotiate?clientProtocol=1.5&connectionData=[{"name":"corehub"}]"#).build()?;
    let mut res = client.execute(rq)?;
    println!("RES: {:?}", res);
    let res = res.json::<Negotiate>()?;

    //
    // https://socket.bittrex.com/signalr/connect?transport=webSockets&clientProtocol=1.5&connectionToken=7tdiI7zF6ezozFSvmAigrwGZhEb6fh2ZswzQYTpmlUbdiaRMgc5WQK8neUN6+Ij04PpiBpa6N3cTBkmWRylZh4xI+j44Gws+AXKBm87qFdptsyKy&connectionData=[{"name":"corehub"}]&tid=9

    let url = format!(r#"wss://socket.bittrex.com/signalr/connect?transport=webSockets&clientProtocol=1.5&connectionToken={}&connectionData=[{{"name":"corehub"}}]"#, res.token);
    ws::connect(url, |mut out| {
        out.send(r#"{"H":"corehub","M":"QueryExchangeState","A":["BTC-ETH"],"I":1}"#).unwrap();
        move |msg| {
            println!("MSG: {:?}", msg);
            Ok(())
        }
    })?;

    Ok(())
}