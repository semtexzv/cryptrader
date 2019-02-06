use crate::prelude::*;

pub struct NetContext {
    pub(crate) uuid: Uuid,
    pub(crate) zmq_ctx: Arc<zmq::Context>,
}

impl NetContext {
    fn new() -> Self {
        NetContext {
            uuid: Uuid::new_v4(),
            zmq_ctx: Arc::new(zmq::Context::new()),
        }
    }
}


pub type ContextHandle = Arc<NetContext>;