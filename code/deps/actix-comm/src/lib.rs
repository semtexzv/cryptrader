#![feature(box_syntax, core_intrinsics, trait_alias)]
#![feature(specialization)]

#![allow(unused_imports, dead_code, unused_variables)]

pub mod prelude;
pub mod ctx;
pub mod msg;
pub mod base;
pub mod addr;
pub mod util;

pub mod export {
    pub use crate::prelude::*;

    pub use crate::ctx::*;
    pub use crate::msg::*;
}

pub use export::*;