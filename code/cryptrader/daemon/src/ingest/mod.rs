use prelude::*;


#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IngestUpdate {
    pub spec: OhlcSpec,
    pub ohlc: Vec<Ohlc>,
}

impl mq::AutoSimpleMultipart for IngestUpdate {}

pub struct IngestStageInfo;

impl ::common::arch::ps::StageInfo for IngestStageInfo {
    const ENDPOINT: &'static str = mq::ENDPOINT_AGGR_IN;
    type Msg = IngestUpdate;
    type FanOpType = arch::ps::FanIn;
}

pub struct Ingest {
    sub: arch::ps::Subscriber<IngestStageInfo>,
    last: BTreeMap<PairId, Ohlc>,
}

impl AppComponent for Ingest {

    fn new(ctx: Context) -> Result<Self> {
        Ok(Ingest {
            sub: arch::ps::Subscriber::new(ctx)?,
            last : BTreeMap::new(),
        })
    }

    fn run(mut self) -> Result<()> {
        loop {
            let mut msg = self.sub.recv()?;
            info!("MSG!! {:?}", msg);
        }
    }
}

impl Ingest {
    fn get_last(&mut self, id : &PairId) -> Option<Ohlc> {
        unimplemented!()
    }
    fn apply_update(&mut self, update : &IngestUpdate) -> Result<()> {
        let id = update.spec.pair_id();
        let mut last_value = self.get_last(id);

        let mut last_time = if let Some(ref s) = last_value {
            s.time
        } else {
            0
        };

        let mut now = (::common::unixtime()) as u64;
        let mut max_stable_time = now - 60;

        let mut filtered: Vec<Ohlc> = update.ohlc
            .iter()
            .filter(|t| t.time >= last_time.saturating_sub(60))
            .map(|x| x.clone())
            .collect();





        Ok(())
    }
}