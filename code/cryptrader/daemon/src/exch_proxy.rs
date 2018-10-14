use prelude::*;

#[derive(Debug)]
pub struct ExchProxyInfo;

impl ::common::arch::proxy::ProxyInfo for ExchProxyInfo {
    const ENDPOINT: &'static str = mq::ENDPOINT_EXCH_SERVICE;
    const WORKER_ENDPOINT: &'static str = mq::ENDPOINT_EXCH_WORKERS;
    type REQ = ExchQuery;
    type REP = ExchReply;
}