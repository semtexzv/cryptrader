#![feature(await_macro, futures_api, async_await)]

use std::{
    future::Future,
    cell::{
        RefCell, Ref, RefMut,
    },
};
use tokio_async_await::compat::backward::Compat;
use futures::Future as Future01;
use actix::prelude::*;
use actix_web::{FutureResponse, error::Error};

// Re-export `tokio::await` for ease-of-use
pub use tokio_async_await::await as compat_await;
pub use tokio_async_await::await;
pub use compat_await as await_compat;
pub use compat_await as comp_await;

macro_rules! define_compat {
    ($name:ident($($arg:ident),*: $($ty:ident),*)) => (
        #[inline]
        pub fn $name<F, Fut, Ret, Err, $($ty,)*>(f: F) -> impl Fn($($ty,)*) -> FutureResponse<Ret>
        where
            F: Fn($($ty,)*) -> Fut,
            Fut: Future<Output = Result<Ret, Err>> + 'static,
            Error: From<Err>,
        {
            move |$($arg,)*| Box::new(Compat::new(f($($arg,)*)).from_err())
        }
    );
}

define_compat!(compat0(:));
define_compat!(compat(arg1: Arg1));
define_compat!(compat2(arg1, arg2: Arg1, Arg2));
define_compat!(compat3(arg1, arg2, arg3: Arg1, Arg2, Arg3));
define_compat!(compat4(arg1, arg2, arg3, arg4: Arg1, Arg2, Arg3, Arg4));
define_compat!(compat5(arg1, arg2, arg3, arg4, arg5: Arg1, Arg2, Arg3, Arg4, Arg5));
define_compat!(compat6(arg1, arg2, arg3, arg4, arg5, arg6: Arg1, Arg2, Arg3, Arg4, Arg5, Arg6));



/*

pub struct ContextRef<A: Actor>(RefCell<*mut A>, RefCell<*mut A::Context>);

impl<A: Actor> ContextRef<A> {
    fn act(&self) -> RefMut<A> {
        unsafe {
            return RefMut::map(self.0.borrow_mut(), |&mut a| &mut *a);
        }
    }
    fn ctx(&self) -> RefMut<A::Context> {
        unsafe {
            return RefMut::map(self.1.borrow_mut(), |&mut a| &mut *a);
        }
    }
}


impl<M: Message, T: Actor> Handler<M> for T where T: AsyncHandler<M> {

}

pub trait AsyncHandler<M: Message>: Actor {
    type Result;
    fn handle_async(this: ContextRef<Self>, msg: M) -> Self::Result;
}
*/