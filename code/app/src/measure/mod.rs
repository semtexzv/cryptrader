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
    /// Ohlc update
    OhlcUpdate {
        update_id: Uuid,
    },
    /// Ohlc saved into database, along with locally measured duration of saving process
    OhlcSaved {
        update_id: Uuid,
        save_duration: Duration,
    },
    /// No evaluation will be performed
    NoEval {
        update_id: Uuid,
    },
    ///
    EvalDispatched {
        eval_id: Uuid,
        update_id: Uuid,
    },
    EvalReceived {
        eval_id: Uuid,
    },
    EvalDataLookup {
        eval_id: Uuid,
        lookup_duration: Duration,
    },
    EvalExecute {
        eval_id: Uuid,
        eval_duration: Duration,
    },
    EvalFinished {
        eval_id: Uuid,
    },
    TradeDispatched {
        eval_id: Uuid,
        update_id: Uuid,
    },
    TradeReturned {
        eval_id: Uuid,
        update_id: Uuid,
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

    eval_dispatch_received: Option<Instant>,
    eval_lookup_time: Option<Duration>,
    eval_exec_time: Option<Duration>,
    eval_finish: Option<Instant>,
}

#[derive(Debug, Clone, Default)]
pub struct UpdateInfo {
    update_time: Option<Instant>,
    save_dur: Option<Duration>,

    no_eval_time: Option<Instant>,
    eval_infos: Vec<Uuid>,

}

pub struct Measurer {
    handle: ContextHandle,
    updates: HashMap<Uuid, UpdateInfo>,
    evals: HashMap<Uuid, EvalInfo>,
}

impl Actor for Measurer { type Context = Context<Self>; }

impl Measurer {
    pub async fn new(handle: ContextHandle) -> Result<Addr<Self>> {
        let sub = await_compat!(Subscriber::<Measurements>::new(handle.clone()))?;


        Ok(Actor::create(move |ctx| {
            sub.register(ctx.address().recipient());
            Self {
                handle,
                updates: Default::default(),
                evals: Default::default(),
            }
        }))
    }
}

impl Handler<MeasureInfo> for Measurer {
    type Result = ();

    fn handle(&mut self, msg: MeasureInfo, ctx: &mut Self::Context) -> Self::Result {
        match msg {
            MeasureInfo::OhlcUpdate { update_id } => {
                let mut item = self.updates.entry(update_id).or_insert(Default::default());
                item.update_time = Some(Instant::now());
            }
            MeasureInfo::OhlcSaved { update_id, save_duration } => {
                let mut item = self.updates.entry(update_id).or_insert(Default::default());
                item.save_dur = Some(save_duration)
            }
            MeasureInfo::NoEval { update_id } => {
                let mut item = self.updates.entry(update_id).or_insert(Default::default());
                item.no_eval_time = Some(Instant::now())
            }
            MeasureInfo::EvalDispatched { update_id, eval_id } => {
                let item = self.updates.entry(update_id.clone()).or_insert(Default::default());
                item.eval_infos.push(eval_id);
                let mut eval = self.evals.entry(eval_id).or_insert(Default::default());
                eval.update_id = update_id;

                eval.eval_dispatch_received = Some(Instant::now());
            }
            MeasureInfo::EvalReceived { eval_id } => {}
            MeasureInfo::EvalDataLookup { eval_id, lookup_duration } => {
                let mut eval = self.evals.entry(eval_id).or_insert(Default::default());
                eval.eval_lookup_time = Some(lookup_duration)
            }
            MeasureInfo::EvalExecute { eval_id, eval_duration } => {
                let mut eval = self.evals.entry(eval_id).or_insert(Default::default());
                eval.eval_exec_time = Some(eval_duration)
            }

            MeasureInfo::EvalFinished { eval_id } => {
                let mut eval = self.evals.entry(eval_id).or_insert(Default::default());
                eval.eval_finish = Some(Instant::now());
                let item = self.updates.entry(eval.update_id.clone()).or_insert(Default::default());

                println!("Eval: {:?} - update : {:?}", eval, item);
            }
            _ => {}
        }
        println!("MSG: {:?}", msg);
    }
}