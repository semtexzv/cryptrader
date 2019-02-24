# Futures ZMQ

[documentation](https://docs.rs/futures-zmq/)
[crates.io](https://crates.io/crates/futures-zmq)

This crate contains wrappers around ZeroMQ Concepts with Futures. It shares an external API with [tokio-zmq](https://docs.rs/tokio-zmq), but unlike tokio-zmq, futures-zmq is OS and Executor agnostic. This comes at the cost of performance, as futures-zmq relies on spinning up a separate thread for managing the ZeroMQ sockets, while tokio-zmq can avoid this issue by letting mio manage the sockets.

Currently Supported Sockets
 - REP
 - REQ
 - PUB
 - SUB
 - PUSH
 - PULL
 - XPUB
 - XSUB
 - PAIR
 - DEALER
 - ROUTER

See the [examples folder](https://git.asonix.dog/asonix/async-zmq/src/branch/development/futures-zmq/examples) for usage examples.

NOTE: These examples use Tokio, but this crate does not require tokio's runtime. Any futures executor should work.

### Getting Started

```toml
futures = "0.1.25"
futures-zmq = "0.4"
tokio = "0.1"
zmq = "0.9"
```

In your application:
```rust
use std::sync::Arc;

use futures::{Future, Stream};
use futures_zmq::{prelude::*, Rep};

fn main() {
    let ctx = Arc::new(zmq::Context::new());
    let rep_fut = Rep::builder(ctx).bind("tcp://*:5560").build();

    let runner = rep_fut.and_then(|rep| {
        let (sink, stream) = rep.sink_stream(25).split();

        stream
            .map(|multipart| {
                // handle the Multipart
                // This example simply echos the incoming data back to the client.
                multipart
            })
            .forward(sink)
    });

    tokio::run(runner.map(|_| ()).or_else(|e| {
        println!("Error: {:?}", e);
        Ok(())
    }));
}
```

### Running the examples
The `req.rs` and `rep.rs` examples are designed to be used together. The `rep` example starts a server with a REP socket, and the `req` example queries that server with a REQ socket.

The `zpub.rs` and `sub.rs` examples should be used togheter. `zpub` produces values that `sub` consumes.

The `push.rs`, `pull_push.rs`, and `pull.rs` files should be used together. `push` produces values, which are relayed by `pull_push` to `pull`, which consumes them and sends a stop signal to itself and to `pull_push`.

`sync_pubsub.rs`, `dealer_router.rs`, and `load_balancing_broker` are all self-contained, and spawn multiple threads.


### Contributing
Feel free to open issues for anything you find an issue with. Please note that any contributed code will be licensed under the GPLv3.

### License

Copyright © 2018 Riley Trautman

Futures ZMQ is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

Futures ZMQ is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. This file is part of Futures ZMQ.

You should have received a copy of the GNU General Public License along with Futures ZMQ. If not, see [http://www.gnu.org/licenses/](http://www.gnu.org/licenses/).
