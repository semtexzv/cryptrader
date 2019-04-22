#![feature(await_macro, async_await, futures_api, box_syntax, specialization)]


use std::future::Future;
pub use tokio_async_await::compat::backward::Compat;
use futures::Future as Future01;
use actix_web::{FutureResponse, error::Error};

// Re-export `tokio::await` for ease-of-use
pub use tokio_async_await::await;
use std::marker::PhantomData;


macro_rules! define_compat {
    ($name:ident($($arg:ident),+: $($ty:ident),+)) => (
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

define_compat!(compat(arg1: Arg1));
define_compat!(compat2(arg1, arg2: Arg1, Arg2));
define_compat!(compat3(arg1, arg2, arg3: Arg1, Arg2, Arg3));
define_compat!(compat4(arg1, arg2, arg3, arg4: Arg1, Arg2, Arg3, Arg4));
define_compat!(compat5(arg1, arg2, arg3, arg4, arg5: Arg1, Arg2, Arg3, Arg4, Arg5));
define_compat!(compat6(arg1, arg2, arg3, arg4, arg5, arg6: Arg1, Arg2, Arg3, Arg4, Arg5, Arg6));
