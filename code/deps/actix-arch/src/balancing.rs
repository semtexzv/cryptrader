use crate::prelude::*;
use crate::svc::ServiceInfo;

pub trait LoadBalancedService<S: ServiceInfo> {
    type WorkerInfo: ServiceInfo = WorkerServiceInfo<S>;
}

pub struct WorkerServiceInfo<S: ServiceInfo>(PhantomData<S>);

impl<S: ServiceInfo + 'static> ServiceInfo for WorkerServiceInfo<S> {
    type RequestType = WorkerRequest<S>;
    type ResponseType = WorkerReply<S>;
    //TODO: create a new endpoint with deterministic host and port
    const ENDPOINT: &'static str = S::ENDPOINT;
}

#[derive(Message)]
#[rtype(result = "WorkerReply<S>")]
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