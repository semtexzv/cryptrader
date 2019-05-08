use crate::prelude::*;

use actix_arch::svc::*;
use uuid::Uuid;
use std::sync::Mutex;

lazy_static! {
    static ref MEASURER : Mutex<Option<Publisher<Measurements>>> = {
        Mutex::new(None)
    };
}

pub fn init_measurer() {
    let p = actix_arch::svc::Publisher::new(new_handle());
    let f = p.map(|i| {
        let mut lck = MEASURER.lock().unwrap();
        *lck = Some(i);
        ()
    }).drop_err();
    Arbiter::spawn(f)
}


pub fn log_measurement(m: MeasureInfo) {
    let lck = MEASURER.lock().unwrap();
    if let Some(ref lck) = lck.deref() {
        lck.do_publish(m)
    };
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum MeasureInfo {
    /// Ohlc saved into database, along with locally measured duration of saving process
    SaveDuration {
        update_id: Uuid,
        save_duration: Duration,
    },
    EvalDispatch {
        update_id: Uuid,
        eval_id: Uuid,
    },
    EvalStart {
        eval_id: Uuid,
    },
    DataLookupDuration {
        eval_id: Uuid,
        lookup_duration: Duration,
    },
    ExecuteDuration {
        eval_id: Uuid,
        eval_duration: Duration,
    },
}

impl Message for MeasureInfo { type Result = (); }

pub struct Measurements;

impl EndpointInfo for Measurements {
    type MsgType = MeasureInfo;
    type FanType = FanIn;

    const ENDPOINT: &'static str = "actix+tcp://measure:42042";
}

#[derive(Debug, Clone, Default)]
pub struct EvalInfo {
    update_id: Uuid,

    dispatched: Option<Instant>,
    received: Option<Instant>,

    eval_lookup_time: Option<Duration>,
    eval_exec_time: Option<Duration>,

}

#[derive(Debug, Clone, Default)]
pub struct UpdateInfo {
    save_dur: Option<Duration>,
}

pub struct Measurer {
    handle: ContextHandle,
    updates: HashMap<Uuid, UpdateInfo>,
    evals: HashMap<Uuid, EvalInfo>,
    start: Instant,
}

impl Actor for Measurer { type Context = Context<Self>; }

use std::fs::File;

fn str_field<S: ToString>(out: &mut csv::Writer<File>, s: S) -> Result<(), failure::Error> {
    Ok(out.write_field(s.to_string())?)
}

impl Measurer {
    pub async fn new(handle: ContextHandle) -> Result<Addr<Self>> {
        let sub = await_compat!(Subscriber::<Measurements>::new(handle.clone()))?;


        Ok(Actor::create(move |ctx: &mut Context<Self>| {
            sub.register(ctx.address().recipient());
            ctx.run_interval(Duration::from_secs(60), |this, ctx| { this.output().unwrap(); });
            Self {
                handle,
                updates: Default::default(),
                evals: Default::default(),
                start: Instant::now(),
            }
        }))
    }

    pub fn output(&mut self) -> Result<(), failure::Error> {
        println!("Outputting data : {:?}", self.evals.len());


        let mut out = csv::Writer::from_path("/data.csv")?;


        for (eval_id, eval) in self.evals.iter() {
            let save_dur = if let Some(u) = self.updates.get(&eval.update_id).clone() {
                u.save_dur
            } else {
                None
            };

            let prop_dur = if let Some(dispatch) = eval.dispatched {
                if let Some(rec) = eval.received {
                    Some(rec.saturating_duration_since(dispatch))
                } else { None }
            } else {
                None
            };

            let data = &[save_dur, prop_dur, eval.eval_lookup_time, eval.eval_exec_time];
            let data: Vec<String> = data.into_iter().map(|d| {
                d.map(|x| x.as_millis().to_string()).unwrap_or("null".into())
            }).collect();

            out.write_record(&data)?;
        }
        out.flush()?;

        Ok(())
    }
}

impl Handler<MeasureInfo> for Measurer {
    type Result = ();

    fn handle(&mut self, msg: MeasureInfo, ctx: &mut Self::Context) -> Self::Result {
        if Instant::now().duration_since(self.start).as_secs() < 300 {
            return;
        }
        match msg {
            MeasureInfo::SaveDuration { update_id, save_duration } => {
                let mut item = self.updates.entry(update_id).or_insert(Default::default());
                item.save_dur = Some(save_duration)
            }

            MeasureInfo::EvalDispatch { eval_id, update_id } => {
                let mut eval = self.evals.entry(eval_id).or_insert(Default::default());
                eval.update_id = update_id;
                eval.dispatched = Some(Instant::now());
            }
            MeasureInfo::EvalStart { eval_id } => {
                let mut eval = self.evals.entry(eval_id).or_insert(Default::default());
                eval.received = Some(Instant::now());
            }
            MeasureInfo::DataLookupDuration { eval_id, lookup_duration } => {
                let mut eval = self.evals.entry(eval_id).or_insert(Default::default());
                eval.eval_lookup_time = Some(lookup_duration)
            }
            MeasureInfo::ExecuteDuration { eval_id, eval_duration } => {
                let mut eval = self.evals.entry(eval_id).or_insert(Default::default());
                eval.eval_exec_time = Some(eval_duration)
            }
        }
    }
}