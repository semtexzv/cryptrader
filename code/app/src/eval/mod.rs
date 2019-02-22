use crate::prelude::*;

use crate::actix_arch::balancing::*;
use actix_arch::balancing::WorkerRequest;


#[derive(Debug,Serialize,Deserialize)]
pub struct EvalRequest {}

impl Message for EvalRequest { type Result = (); }

pub struct EvalService;

impl ServiceInfo for EvalService {
    type RequestType = EvalRequest;
    type ResponseType = ();
    const ENDPOINT: &'static str = "actix://ingest:42044/eval";
}
