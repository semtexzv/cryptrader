use crate::prelude::*;
use crate::svc::ServiceInfo;
use actix_comm::msg::RemoteError;
use crate::svc::ServiceConnection;
use actix::Response;
use crate::svc::ServiceHandler;
use actix_comm::ContextHandle;
use crate::svc::ServiceRequest;
use std::collections::vec_deque::VecDeque;
use std::collections::btree_map::BTreeMap;
use common::tokio::prelude::FutureExt;
use actix_comm::Remotable;


#[derive(Debug)]
pub struct WorkerServiceInfo<S: ServiceInfo>(PhantomData<S>);


#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum WorkerRequest<S: ServiceInfo> {
    Available,
    WorkDone(u64, S::ResponseType),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum WorkerReply<S: ServiceInfo> {
    NothingYet,
    Work(u64, S::RequestType),
}


impl<S: ServiceInfo + 'static> ServiceInfo for WorkerServiceInfo<S> {
    type RequestType = WorkerRequest<S>;
    type ResponseType = WorkerReply<S>;
    const ENDPOINT: &'static str = S::ENDPOINT;
}


#[derive(Debug)]
pub struct BalancedInfo<S: ServiceInfo>(PhantomData<S>);

impl<S: ServiceInfo + 'static> ServiceInfo for BalancedInfo<S> {
    type RequestType = (S::RequestType, ());
    type ResponseType = (S::ResponseType, ());
    const ENDPOINT: &'static str = S::ENDPOINT;
}

pub trait Distributable: Remotable {
    type Key = String;
    fn get_key(&self) -> Self::Key;
}


pub struct LoadBalancer<S: ServiceInfo> {
    handler: ServiceHandler<S>,
    worker_handler: ServiceHandler<WorkerServiceInfo<S>>,

    workers: BTreeMap<u64, OneSender<WorkerReply<S>>>,
    running: BTreeMap<u64, OneSender<S::ResponseType>>,
    waiting: VecDeque<(S::RequestType, OneSender<S::ResponseType>)>,
}

impl<S: ServiceInfo> Actor for LoadBalancer<S> { type Context = Context<Self>; }

impl<S: ServiceInfo> LoadBalancer<S> {
    pub async fn new(handle: ContextHandle) -> Result<Addr<Self>> {
        let handler = compat_await!(ServiceHandler::new(handle.clone()))?;


        let worker_handler: ServiceHandler<WorkerServiceInfo<S>> = ServiceHandler::from_other(handle.clone(), &handler.clone());

        Ok(Actor::create(move |ctx| {
            handler.register(ctx.address().recipient());
            worker_handler.register(ctx.address().recipient());

            LoadBalancer {
                handler,
                worker_handler,

                workers: BTreeMap::new(),
                running: BTreeMap::new(),
                waiting: VecDeque::new(),
            }
        }))
    }

    fn new_work_id(&self) -> u64 {
        self.running.iter().last().map(|i| *i.0).unwrap_or(0) + 1
    }
    fn new_worker_id(&self) -> u64 {
        self.workers.iter().last().map(|i| *i.0).unwrap_or(0) + 1
    }

    fn worker_available(&mut self) -> ResponseActFuture<Self, WorkerReply<S>, RemoteError> {
        let (tx, rx) = oneshot::<WorkerReply<S>>();
        debug!("Worker available");

        if let Some((work, sender)) = self.waiting.pop_front() {
            debug!("Dispatching immediately");
            let id = self.new_work_id();
            tx.send(WorkerReply::Work(id, work)).unwrap();
            self.running.insert(id, sender);
            return box wrap_future(rx.unwrap_err().set_err(RemoteError::MailboxClosed));
        } else {
            debug!("Parking worker");
            let worker_id = self.new_worker_id();
            self.workers.insert(worker_id, tx);

            let fut = wrap_future(rx.timeout(Duration::from_secs(3)));
            let fut = fut.then(move |res, this: &mut Self, _ctx| {
                let next = match res {
                    Ok(a) => Ok(a),
                    Err(ref e) if e.is_inner() => {
                        debug!("Worker reply error occured : {:?}", e);
                        Err(RemoteError::Other(e.to_string()))
                    }
                    Err(_) => {
                        debug!("No work available - releasing worker");
                        Ok(WorkerReply::NothingYet)
                    }
                };
                this.workers.remove(&worker_id);
                afut::result::<_, RemoteError, _>(next)
            });

            return box fut;
        }
    }
}


impl<S: ServiceInfo> Handler<ServiceRequest<WorkerServiceInfo<S>>> for LoadBalancer<S> {
    type Result = actix::ResponseActFuture<Self, WorkerReply<S>, RemoteError>;

    fn handle(&mut self, msg: ServiceRequest<WorkerServiceInfo<S>>, ctx: &mut Self::Context) -> Self::Result {
        match msg.0 {
            WorkerRequest::Available => {
                let rx = self.worker_available();
                return rx;
            }
            WorkerRequest::WorkDone(id, resp) => {
                debug!("Work {:?} is done, returning to requester", id);
                let tx = self.running.remove(&id).unwrap();
                tx.send(resp).unwrap();
                return self.worker_available();
            }
        }
    }
}

impl<S: ServiceInfo> Handler<ServiceRequest<S>> for LoadBalancer<S> {
    type Result = actix::Response<S::ResponseType, RemoteError>;

    fn handle(&mut self, msg: ServiceRequest<S>, _ctx: &mut Self::Context) -> Self::Result {
        debug!("Work request available");
        let id = self.new_work_id();
        let (tx, rx) = oneshot::<S::ResponseType>();

        if let Some((_, worker)) = self.workers.pop_first() {
            debug!("Dispatching immediately");
            worker.send(WorkerReply::Work(id, msg.0)).unwrap();
            self.running.insert(id, tx);
        } else {
            debug!("parking work request");
            self.waiting.push_back((msg.0, tx));
        }
        return Response::r#async(rx.map_err(|_e| RemoteError::MailboxClosed));
    }
}

pub struct WorkerProxy<S: ServiceInfo> {
    handle: ContextHandle,
    conn: ServiceConnection<WorkerServiceInfo<S>>,
    handler: Recipient<ServiceRequest<S>>,
}

impl<S: ServiceInfo> Actor for WorkerProxy<S> {
    type Context = Context<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        self.send(WorkerRequest::Available, ctx);
    }
}

impl<S: ServiceInfo> WorkerProxy<S> {
    pub fn new(handle: ContextHandle, handler: Recipient<ServiceRequest<S>>) -> BoxFuture<Addr<Self>> {
        let conn = ServiceConnection::new(handle.clone());
        return box conn.map(|conn| {
            Actor::create(|_ctx| {
                WorkerProxy {
                    handle,
                    conn,
                    handler,
                }
            })
        }).from_err();
    }

    fn send(&mut self, req: WorkerRequest<S>, ctx: &mut Context<Self>) {
        debug!("Sending to balancer {:?}", req);
        let fut = wrap_future(self.conn.send(req));
        ctx.spawn(
            fut.then(|msg, this: &mut Self, ctx| {
                this.handle_reply(msg.unwrap(), ctx);
                afut::ok(())
            })
        );
    }

    fn handle_reply(&mut self, reply: WorkerReply<S>, ctx: &mut Context<Self>) {
        debug!("Receivied balancer reply {:?}", reply);
        match reply {
            WorkerReply::NothingYet => {
                self.send(WorkerRequest::Available, ctx);
            }
            WorkerReply::Work(id, work) => {
                let work = self.handler.send(ServiceRequest(work));
                let fut = wrap_future(work);

                ctx.spawn(fut.map(move |v, this: &mut Self, ctx: &mut _| {
                    debug!("Worker finished {:?}", v);
                    this.send(WorkerRequest::WorkDone(id, v.unwrap()), ctx);
                    ()
                }).drop_err());
            }
        }
    }
}
