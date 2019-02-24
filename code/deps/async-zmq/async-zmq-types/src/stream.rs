/*
 * This file is part of Async ZMQ Types.
 *
 * Copyright © 2018 Riley Trautman
 *
 * Async ZMQ Types is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Async ZMQ Types is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Async ZMQ Types.  If not, see <http://www.gnu.org/licenses/>.
 */

use std::marker::PhantomData;

use futures::{Async, Stream};

use crate::{ControlHandler, EndHandler, Multipart};

/// A stream that ends when the `EndHandler`'s `should_stop` method returns True
pub struct EndingStream<E, S, F>
where
    E: EndHandler,
    S: Stream<Item = Multipart, Error = F>,
{
    stream: S,
    // To handle stopping
    end_handler: E,
    phantom: PhantomData<F>,
}

impl<E, S, F> EndingStream<E, S, F>
where
    E: EndHandler,
    S: Stream<Item = Multipart, Error = F>,
{
    /// Wrap a stream with an EndHandler
    pub fn new(stream: S, end_handler: E) -> Self
    where
        E: EndHandler,
    {
        EndingStream {
            stream,
            end_handler,
            phantom: PhantomData,
        }
    }
}

impl<E, S, F> Stream for EndingStream<E, S, F>
where
    E: EndHandler,
    S: Stream<Item = Multipart, Error = F>,
{
    type Item = Multipart;
    type Error = F;

    fn poll(&mut self) -> Result<Async<Option<Multipart>>, F> {
        let res = match self.stream.poll()? {
            Async::Ready(Some(item)) => {
                if self.end_handler.should_stop(&item) {
                    Async::Ready(None)
                } else {
                    Async::Ready(Some(item))
                }
            }
            Async::Ready(None) => Async::Ready(None),
            Async::NotReady => Async::NotReady,
        };

        Ok(res)
    }
}

/// `ControlledStream`s are used when you want a stream of multiparts, but you want to be able to
/// turn it off.
///
/// It contains a handler that implements the `ControlHandler` trait. This trait contains a single
/// method `should_stop`, that determines whether or not the given stream should stop producing
/// values.
pub struct ControlledStream<H, S, T, F>
where
    H: ControlHandler,
    S: Stream<Item = Multipart, Error = F>,
    T: Stream<Item = Multipart, Error = F>,
{
    stream: T,
    control: S,
    handler: H,
    phantom: PhantomData<F>,
}

impl<H, S, T, F> ControlledStream<H, S, T, F>
where
    H: ControlHandler,
    S: Stream<Item = Multipart, Error = F>,
    T: Stream<Item = Multipart, Error = F>,
{
    /// Create a new ControlledStream.
    ///
    /// This shouldn't be called directly. A socket wrapper type's `controlled` method, if present,
    /// will perform the required actions to create and encapsulate this type.
    pub fn new(stream: T, control: S, handler: H) -> ControlledStream<H, S, T, F> {
        ControlledStream {
            stream,
            control,
            handler,
            phantom: PhantomData,
        }
    }
}

impl<H, S, T, F> Stream for ControlledStream<H, S, T, F>
where
    H: ControlHandler,
    S: Stream<Item = Multipart, Error = F>,
    T: Stream<Item = Multipart, Error = F>,
{
    type Item = Multipart;
    type Error = F;

    /// Poll the control stream, if it isn't ready, poll the producing stream
    ///
    /// If the control stream is ready, but has ended, stop the producting stream.
    /// If the control stream is ready with a Multipart, use the `ControlHandler`
    /// to determine if the producting stream should be stopped.
    fn poll(&mut self) -> Result<Async<Option<Multipart>>, F> {
        let stop = match self.control.poll()? {
            Async::NotReady => false,
            Async::Ready(None) => true,
            Async::Ready(Some(multipart)) => self.handler.should_stop(multipart),
        };

        if stop {
            Ok(Async::Ready(None))
        } else {
            self.stream.poll()
        }
    }
}
