use ::prelude::*;


pub struct DummyUpdate {
    pub time : u64
}

impl Message for DummyUpdate {
    type Result = ();
}