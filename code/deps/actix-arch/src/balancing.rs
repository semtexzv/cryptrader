use crate::prelude::*;
use crate::svc::ServiceInfo;
use actix_comm::msg::RemoteError;
use crate::svc::ServiceConnection;
use actix::Response;
use crate::svc::ServiceHandler;
use actix_comm::ContextHandle;
use crate::svc::ServiceRequest;

pub trait LoadBalancedService<S: ServiceInfo> {
    type WorkerInfo: ServiceInfo = WorkerServiceInfo<S>;
}

#[derive(Debug)]
pub struct WorkerServiceInfo<S: ServiceInfo>(PhantomData<S>);


#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum WorkerRequest<S: ServiceInfo> {
    Hello,
    Available,
    WorkDone(u64, S::ResponseType),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum WorkerReply<S: ServiceInfo> {
    HelloReply,
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


pub struct LoadBalancer<S: ServiceInfo> {
    handle: ContextHandle,

    handler: ServiceHandler<S>,
    worker_handler: ServiceHandler<WorkerServiceInfo<S>>,

    workers: Vec<OneSender<WorkerReply<S>>>,
    requests: BTreeMap<u64, OneSender<S::ResponseType>>,
}

impl<S: ServiceInfo> Actor for LoadBalancer<S> { type Context = Context<Self>; }

impl<S: ServiceInfo> LoadBalancer<S> {
    pub fn new(handle: ContextHandle) -> BoxFuture<Addr<Self>> {
        let handler = ServiceHandler::new(handle.clone());


        return box handler.map(move |handler: ServiceHandler<S>| {
            let worker_handler: ServiceHandler<WorkerServiceInfo<S>> = ServiceHandler::from_other(handle.clone(), &handler.clone());

            Actor::create(move |ctx| {
                handler.register(ctx.address().recipient());
                worker_handler.register(ctx.address().recipient());

                LoadBalancer {
                    handle,

                    handler,
                    worker_handler,

                    workers: vec![],
                    requests: BTreeMap::new(),
                }
            })
        }).map_err(Into::into);
    }
}

impl<S: ServiceInfo> Handler<ServiceRequest<WorkerServiceInfo<S>>> for LoadBalancer<S> {
    type Result = actix::Response<WorkerReply<S>, RemoteError>;

    fn handle(&mut self, msg: ServiceRequest<WorkerServiceInfo<S>>, ctx: &mut Self::Context) -> Self::Result {
        info!("Worker available : {:?}", msg);
        match msg.0 {
            WorkerRequest::Available | WorkerRequest::Hello => {
                let (tx, rx) = oneshot::<WorkerReply<S>>();
                self.workers.push(tx);
                return Response::r#async(rx.map_err(|e| RemoteError::MailboxClosed));
            }
            WorkerRequest::WorkDone(id, resp) => {
                unimplemented!()
            }
        }
    }
}

impl<S: ServiceInfo> Handler<ServiceRequest<S>> for LoadBalancer<S> {
    type Result = actix::Response<S::ResponseType, RemoteError>;

    fn handle(&mut self, msg: ServiceRequest<S>, ctx: &mut Self::Context) -> Self::Result {
        let id: u64 = self.requests.iter().last().map(|i| *i.0).unwrap_or(0);
        if let Some(worker) = self.workers.pop() {
            let res = worker.send(WorkerReply::Work(id, msg.0));
            let (tx, rx) = oneshot::<S::ResponseType>();
            self.requests.insert(id, tx);
            return Response::r#async(rx.map_err(|e| RemoteError::MailboxClosed));
        }
        panic!("Not enough workers");
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
            Actor::create(|ctx| {
                WorkerProxy {
                    handle,
                    conn,
                    handler,
                }
            })
        }).from_err();
    }

    fn send(&mut self, req: WorkerRequest<S>, ctx: &mut Context<Self>) {
        let fut = wrap_future(self.conn.send(WorkerRequest::Available));
        ctx.spawn(
            fut.then(|msg, this: &mut Self, ctx| {
                this.handle_reply(msg.unwrap(), ctx);
                afut::ok(())
            })
        );
    }

    fn handle_reply(&mut self, reply: WorkerReply<S>, ctx: &mut Context<Self>) {
        info!("Receivied worker reply {:?}", reply);
        match reply {
            WorkerReply::HelloReply => {
                self.send(WorkerRequest::Available, ctx);
            }
            WorkerReply::Work(id, work) => {
                let work = self.handler.send(ServiceRequest(work));
                let fut = wrap_future(work);

                ctx.spawn(fut.map(move |v, this: &mut Self, ctx: &mut _| {
                    this.send(WorkerRequest::WorkDone(id, v.unwrap()), ctx);
                    ()
                }).drop_err());
            }
        }
    }
}
