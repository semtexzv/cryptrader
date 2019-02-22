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


pub struct BalancedInfo<S: ServiceInfo>(PhantomData<S>);

impl<S: ServiceInfo + 'static> ServiceInfo for BalancedInfo<S> {
    type RequestType = (S::RequestType,());
    type ResponseType = (S::ResponseType,());
    const ENDPOINT: &'static str = S::ENDPOINT;
}



pub struct LoadBalancer<S : ServiceInfo> {
    _s : PhantomData<S>,
    handle : ContextHandle,
    handler : ServiceHandler<S>,
    worker_handler : ServiceHandler<WorkerServiceInfo<S>>,

    workers : Vec<OneSender<WorkerReply<S>>>,
    requests : BTreeMap<u64, OneSender<S::ResponseType>>
}

impl<S :ServiceInfo> Actor for LoadBalancer<S> { type Context = Context<Self>; }


impl<S : ServiceInfo> LoadBalancer<S> {
    pub fn new(handle : ContextHandle) -> BoxFuture<Addr<Self>> {
        let handler = ServiceHandler::new(handle.clone());

        return box handler.map(move |handler : ServiceHandler<S>| {

            Actor::create(|ctx| {

                let worker_handler : ServiceHandler<WorkerServiceInfo<S>> = ServiceHandler::from_other(handle.clone(), &handler);
                worker_handler.register(ctx.address().recipient());
                LoadBalancer {
                    _s : PhantomData,
                    handle,
                    handler,
                    worker_handler,
                    workers : vec![],
                    requests : BTreeMap::new(),
                }
            })
        }).map_err(Into::into)
    }
}

impl<S : ServiceInfo> Handler<ServiceRequest<WorkerServiceInfo<S>>> for LoadBalancer<S> {
    type Result = actix::Response<WorkerReply<S>,RemoteError>;

    fn handle(&mut self, msg: ServiceRequest<WorkerServiceInfo<S>>, ctx: &mut Self::Context) -> Self::Result {

        match msg.0 {
            WorkerRequest::Available | WorkerRequest::Hello => {
                let (tx,rx) = oneshot::<WorkerReply<S>>();
                self.workers.push(tx);
                return Response::r#async(rx.map_err(|e| RemoteError::MailboxClosed));
            }
            WorkerRequest::WorkDone(id,resp) => {
                unimplemented!()
            }
        }
    }
}

impl<S : ServiceInfo> Handler<ServiceRequest<BalancedInfo<S>>> for LoadBalancer<S> {
    type Result = actix::Response<(S::ResponseType,()),RemoteError>;

    fn handle(&mut self, msg: ServiceRequest<BalancedInfo<S>>, ctx: &mut Self::Context) -> Self::Result {
        let id : u64 = self.requests.iter().last().map(|i| *i.0).unwrap_or(0);
        if let Some(worker) = self.workers.pop() {
            let res  = worker.send(WorkerReply::Work(id,(msg.0).0));
            let (tx,rx) = oneshot::<S::ResponseType>();
            self.requests.insert(id,tx);
            return Response::r#async(rx.map(|it| (it,())).map_err(|e| RemoteError::MailboxClosed));
        }
        panic!("Not enough workers");
        // Received work from proxy handler
    }
}

pub struct ServiceProxy<S : ServiceInfo> {
    handle : ContextHandle,
    handler : ServiceHandler<S>,
    rec : Recipient<ServiceRequest<BalancedInfo<S>>>
}
impl<S : ServiceInfo> ServiceProxy<S> {
    fn new(handle : ContextHandle, handler : ServiceHandler<S>, balancer : Addr<LoadBalancer<S>>) -> Addr<Self> {
        Actor::create(|ctx| {

            handler.register(ctx.address().recipient());
            ServiceProxy {
                handle,
                handler,
                rec : balancer.recipient(),
            }
        })
    }
}
impl<S : ServiceInfo> Actor for ServiceProxy<S> { type Context = Context<Self>; }

impl<S : ServiceInfo>  Handler<ServiceRequest<S>> for ServiceProxy<S> {
    type Result = Response<S::ResponseType,RemoteError>;

    fn handle(&mut self, msg: ServiceRequest<S>, ctx: &mut Self::Context) -> Self::Result {
        Response::r#async(self.rec.send(ServiceRequest((msg.0,()))).map(|x| x.unwrap().0).from_err())
    }
}



pub struct BalancedWorker<S : ServiceInfo> {
    handle : ContextHandle,
}

impl<S : ServiceInfo> BalancedWorker<S> {
    fn new(handle : ContextHandle) -> 
}