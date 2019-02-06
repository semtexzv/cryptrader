#![feature(never_type)]

use futures::prelude::*;


pub struct DropErr<F> {
    f: F,
}

impl<F: Future> Future for DropErr<F> {
    type Item = F::Item;
    type Error = ();

    #[inline(always)]
    fn poll(&mut self) -> Result<Async<Self::Item>, Self::Error> {
        match self.f.poll() {
            Ok(a @ _) => Ok(a),
            Err(_) => Err(())
        }
    }
}

pub struct DropItem<F> {
    f: F
}

impl<F: Future> Future for DropItem<F> {
    type Item = ();
    type Error = F::Error;

    #[inline(always)]
    fn poll(&mut self) -> Result<Async<Self::Item>, Self::Error> {
        match self.f.poll() {
            Ok(Async::Ready(_)) => Ok(Async::Ready(())),
            Ok(Async::NotReady) => Ok(Async::NotReady),
            Err(e) => Err(e)
        }
    }
}

use std::fmt::Debug;

pub struct UnwrapErr<F>(F);

impl<F: Future> Future for UnwrapErr<F>
    where F::Error: Debug
{
    type Item = F::Item;
    type Error = !;

    fn poll(&mut self) -> Result<Async<Self::Item>, Self::Error> {
        return Ok(self.0.poll().unwrap());
    }
}

pub struct SetErr<F, E>(F, Option<E>);

impl<F: Future, E> Future for SetErr<F, E> {
    type Item = F::Item;
    type Error = E;

    fn poll(&mut self) -> Result<Async<Self::Item>, Self::Error> {
        match self.0.poll() {
            Ok(a) => Ok(a),
            Err(_) => Err(self.1.take().unwrap())
        }
    }
}

pub trait FutureExt: Future + Sized {
    fn drop_err(self) -> DropErr<Self> {
        return DropErr { f: self };
    }
    fn drop_item(self) -> DropItem<Self> {
        return DropItem { f: self };
    }
    fn unwrap_err(self) -> UnwrapErr<Self> {
        return UnwrapErr(self);
    }
    fn set_err<E>(self, e: E) -> SetErr<Self, E> {
        return SetErr(self, Some(e));
    }
}

impl<F> FutureExt for F where F: Future + Sized {}