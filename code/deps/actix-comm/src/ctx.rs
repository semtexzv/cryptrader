use crate::prelude::*;

/// Struct containing information about this node. Will be shared between all zeromq enabled
/// actors in this process
pub struct NetContext {
    pub uuid: Uuid,
    pub zmq_ctx: Arc<zmq::Context>,
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
/// Create new reference countet handle to a context
pub fn new_handle() -> ContextHandle {
    Arc::new(NetContext::new())
}