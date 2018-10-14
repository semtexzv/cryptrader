use ::prelude::*;


pub struct OhlcSvcInfo;

impl ServiceInfo for OhlcSvcInfo {
    const ENDPOINT: &'static str = mq::ENDPOINT_DBPROVIDER;
    type REQ = svc_types::ohlc::OhlcQuery;
    type REP = svc_types::ohlc::OhlcResponse;
}

pub struct OhlcService {
    svc: Service<OhlcSvcInfo>,
    conn: db::ConnType,
    cache: BTreeMap<OhlcSpec, BTreeMap<u64, Ohlc>>,
}

impl ::common::AppComponent for OhlcService {
    fn new(ctx: ::zmq::Context) -> Result<Self> {
        return Ok(OhlcService {
            svc: Service::new(ctx)?,
            conn: db::connect_store(),
            cache: BTreeMap::new(),
        });
    }

    fn run(mut self) -> Result<()> {
        // info!("OhlcService Initializing");
        loop {
            let (address, mut rq) = self.svc.request()?;
            info!("OhlcService got rq : {:?}", rq);
            let cached = self.cache.entry(rq.spec.clone()).or_insert_with(|| BTreeMap::new());

            let max_ohlc = cached.iter().next_back()
                .map(second)
                .map(clone);

            let mut start_time = if let Some(d) = max_ohlc {
                d.time
            } else {
                rq.start
            };
            start_time = rq.spec.period().clamp_time(start_time);

            let t1 = PreciseTime::now();
            let r = ::db::resampled_ohlc_values(&self.conn, &rq.spec, start_time);
            for x in r {
                cached.insert(x.time, x);
            }
            let t2 = PreciseTime::now();

            let data: Vec<Ohlc> = cached.range(rq.start..rq.end + 1).map(second).map(clone).collect();
            info!("DataProvider load time for {}  =  {} ({} items) : {:?}", rq.spec, t1.to(t2).num_milliseconds(), data.len(), data);
            let mut rep = OhlcResponse {
                ohlc: data,
                query: rq,
            };
            self.svc.reply(address, rep)?;
        }
    }
}