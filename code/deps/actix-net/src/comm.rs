use ::prelude::*;
use node::Node;
use std::collections::HashMap;
use msg::RemoteMessage;


pub struct Communicator {
    nodes: HashMap<Url, Addr<Node>>,
}

impl Communicator {
    fn new(addr: String) -> Result<Self, failure::Error> {
        unimplemented!()
    }
}

