use crate::prelude::*;
use crate::msg::*;
use crate::util::*;
use std::collections::btree_map::BTreeMap;

pub struct AddressRegistry {
    names: BTreeMap<String, HandlerRegistry>
}

impl AddressRegistry {}

impl Actor for AddressRegistry { type Context = Context<Self>; }
impl Handler<crate::util::ErasedMessage> for AddressRegistry {
    type Result = Result<WrappedType,RemoteError>;

    fn handle(&mut self, msg: ErasedMessage, ctx: &mut Self::Context) -> Self::Result {
        unimplemented!()
    }
}