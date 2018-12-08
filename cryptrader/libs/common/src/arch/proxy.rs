use ::prelude::*;
use super::service::{Service, ServiceInfo};

pub trait RoutableMsg: mq::MultipartMsg + Serialize + DeserializeOwned + Debug {
    fn rq_type(&self) -> &str;
}

pub trait ProxyInfo: 'static + Debug {
    const ENDPOINT: &'static str;
    const WORKER_ENDPOINT: &'static str;

    type REQ: RoutableMsg;
    type REP: mq::MultipartMsg + Serialize + DeserializeOwned + Debug;
}

impl<T> ServiceInfo for T where T: ProxyInfo {
    const ENDPOINT: &'static str = T::ENDPOINT;

    type REQ = T::REQ;
    type REP = T::REP;
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum WorkerMessage<I: ProxyInfo> {
    // Register this worker, to following messages, this method is called only once, at the start
    RegisterAvailability(String),
    Reply(I::REP),
}

impl<I: ProxyInfo> mq::AutoSimpleMultipart for WorkerMessage<I> {}

#[derive(Debug)]
pub struct WorkerService<I: ProxyInfo>(::std::marker::PhantomData<I>);

impl<I: ProxyInfo> ServiceInfo for WorkerService<I> {
    const ENDPOINT: &'static str = I::WORKER_ENDPOINT;

    type REQ = WorkerMessage<I>;
    type REP = I::REQ;
}

#[derive(Clone, Debug)]
pub struct RunningReqInfo {
    src_add: mq::Address,
    sent: u64,
}

impl RunningReqInfo {
    fn new(add: mq::Address) -> Self {
        return RunningReqInfo {
            src_add: add,
            sent: unixtime() as u64,
        };
    }
}

use std::collections::BTreeSet;

pub struct Proxy<I: ProxyInfo> {
    service: Service<I>,
    work_svc: Service<WorkerService<I>>,
    worker_capabilities: BTreeMap<mq::Address, regex::Regex>,
    available_workers: BTreeSet<mq::Address>,
    /// Map : worker_add -> Request info
    running_requests: BTreeMap<mq::Address, RunningReqInfo>,
    cached_requests: Vec<(mq::Address, I::REQ)>,
}


impl<I: ProxyInfo> ::AppComponent for Proxy<I> {
    fn new(ctx: ::zmq::Context) -> Result<Self> {
        Ok(Proxy {
            service: Service::new(ctx.clone())?,
            work_svc: Service::new(ctx.clone())?,
            worker_capabilities: BTreeMap::new(),
            available_workers: BTreeSet::new(),
            running_requests: BTreeMap::new(),
            cached_requests: Vec::new(),
        })
    }

    fn run(mut self) -> Result<()> {
        loop {
            let (service_rdy, workers_rdy) = {
                let mut polls = [self.service.as_rd_poll_item(), self.work_svc.as_rd_poll_item()];
                ::zmq::poll(&mut polls[..], -1)?;
                (polls[0].is_readable(), polls[1].is_readable())
            };

            if service_rdy {
                let (src_add, mut msg) = self.service.request()?;
                //info!("Proxy RQ: {:?}", msg);

                let mut worker_address: Option<mq::Address> = None;


                for (ref w, ref mut r) in self.worker_capabilities.iter() {
                    if r.is_match(msg.rq_type()) {
                        if let Some(x) = self.available_workers.take(*w) {
                            worker_address = Some(x)
                        }
                    }
                }

                if let Some(add) = worker_address {
                    let mut info = RunningReqInfo::new(src_add);
                    self.running_requests.insert(add.clone(), info);

                    self.work_svc.reply(add, msg)?;
                } else {
                    error!("No workers available for Proxy request");
                }
            }

            if (workers_rdy) {
                let (add, mut msg) = self.work_svc.request()?;
                //info!("Proxy Response: {:?}", msg);
                match msg {
                    WorkerMessage::RegisterAvailability(regex) => {
                        self.worker_capabilities.insert(add.clone(), Regex::new(&regex)?);
                        self.available_workers.insert(add.clone());
                        //info!("Proxy Worker available: {:?}, pattern : {:?}", add, regex);
                    }
                    WorkerMessage::Reply(reply) => {
                        if let Some(rq) = self.running_requests.remove(&add) {
                            self.service.reply(rq.src_add, reply)?;
                        } else {
                            error!("Did not find running request");
                        }
                        self.available_workers.insert(add);
                    }
                }
            }
        }
    }
}