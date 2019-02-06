use crate::prelude::*;
use crate::msg::*;
use crate::util::*;
use std::collections::btree_map::BTreeMap;

pub struct AddressRegistry {
    names: BTreeMap<String, HandlerRegistry>
}