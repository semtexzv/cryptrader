pub use crate::prelude::*;
use crate::api::rest::v2::candles_history_until;
use common::msgs::{IngestUpdate};


#[derive(Debug, Clone)]
pub struct DumpInfo {
    last_time: i64,
}


pub struct BitfinexDumper {
    client: anats::Client,
    handle: Option<SpawnHandle>,
    pairs: BTreeMap<TradePair, DumpInfo>,
}
impl_invoke!(BitfinexDumper);

impl BitfinexDumper {
    pub async fn new(client: anats::Client) -> Result<Addr<Self>, actix_web::Error> {
        info!("Waiting before starting data dumping process");
        tokio::timer::Delay::new(Instant::now() + Duration::from_secs(120)).compat().await.unwrap();
        let pairs = crate::api::rest::v2::config_exchange_pairs().await?;
        Ok(Arbiter::start(|ctx| {
            BitfinexDumper {
                client,
                pairs: pairs.into_iter().map(|pair| {
                    (pair, DumpInfo {
                        last_time: unixtime(),
                    })
                }).collect(),
                handle: None,
            }
        }))
    }

    pub fn start_dump_iter(&mut self, ctx: &mut Context<Self>) {
        let addr = ctx.address();
        let client = self.client.clone();

        let mut pairs = self.pairs.clone().into_iter().collect::<Vec<_>>();
        pairs.sort_by_key(|(k, v)| i64::max_value() - v.last_time);

        let fut = async move {
            info!("Waiting before next data dump iteration");
            tokio::timer::Delay::new(Instant::now() + Duration::from_secs(30)).compat().await.unwrap();

            for (p, info) in pairs.into_iter() {
                let data = candles_history_until(OhlcPeriod::Min1, p.clone(), 4000, info.last_time).await.unwrap();
                info!("Retrieved {:?} candles for {:?}", data.len(), p);

                let update = IngestUpdate {
                    spec: OhlcSpec::new(Exchange::Bitfinex, p.clone(), OhlcPeriod::Min1),
                    ohlc: data.clone(),
                };

                let saved = client.request(common::CHANNEL_OHLC_IMPORT, update)
                    .timeout(Duration::from_secs(30))
                    .compat()
                    .await;


                match saved {
                    Ok(_) => {
                        if data.len() > 0 {
                            let first = data[0].time as _;
                            ActorExt::invoke(addr.clone(), move |this: &mut Self, ctx| {
                                this.pairs.get_mut(&p).unwrap().last_time = first;
                            }).await;
                        }
                    }
                    Err(err) => {
                        error!("Could not save {:?} - {} occured", p, err);
                    }
                }

                tokio::timer::Delay::new(Instant::now() + Duration::from_secs(1)).compat().await.unwrap()
            }

            addr.invoke(|this, ctx| {
                this.start_dump_iter(ctx);
            }).await;

            Ok::<_, ()>(())
        };

        self.handle = Some(ctx.spawn(wrap_future(fut.boxed_local().compat())));
    }
    pub fn cancel_dump(&mut self, ctx: &mut Context<Self>) {
        if let Some(handle) = self.handle.take() {
            ctx.cancel_future(handle);
        }
    }
}

impl Actor for BitfinexDumper {
    type Context = Context<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        self.start_dump_iter(ctx)
    }
}