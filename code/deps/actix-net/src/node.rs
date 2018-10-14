use ::prelude::*;
use super::msg::*;
use std::sync::Arc;

use tokio_zmq::async_types::{MultipartSink, MultipartStream, MultipartSinkStream};


enum NodeState {
    Created(String),
    Running {
        sink: futures::stream::SplitSink<tokio_zmq::async_types::MultipartSinkStream>,
    },
}

/// Network node actor
pub struct Node {
    state: NodeState,
}

impl Actor for Node {
    type Context = Context<Self>;

    fn started(&mut self, ctx: &mut <Self as Actor>::Context) {
        self.state = match self.state {
            NodeState::Created(ref url) => {
                let zmq_ctx = Arc::new(::zmq::Context::new());

                let sock = Router::builder(zmq_ctx.clone());
                let sock = sock
                    .identity(b"test")
                    .connect(&url.to_string())
                    .build().unwrap();

                let mut inner = sock.socket();

                let (sink, stream) = inner.sink_stream().split();

                let stream = stream.map(|v| {
                    println!("Stream received item");
                    v
                });
                Self::add_stream(stream, ctx);
                NodeState::Running {
                    sink
                }
            }
            NodeState::Running { .. } => {
                panic!()
            }
        }
    }
}

impl StreamHandler<Multipart, ::tokio_zmq::Error> for Node {
    fn handle(&mut self, item: Multipart, ctx: &mut Context<Self>) {
        unimplemented!()
    }

    fn started(&mut self, ctx: & mut Context<Self>) {
        print!("Started stream handler")
    }

    fn error(&mut self, err: ::tokio_zmq::Error, ctx: & mut Context<Self>) -> Running {
        print!("Started StreamError");
        Running::Continue
    }
}

impl<R> Handler<SendMessage<R>> for Node
    where R: RemoteMessage + Send + Serialize + DeserializeOwned + 'static,
          R::Result: Send + Serialize + DeserializeOwned + 'static,
          R::Result: actix::dev::MessageResponse<Self, SendMessage<R>>
{
    type Result = R::Result;

    fn handle(&mut self, msg: SendMessage<R>, ctx: &mut Context<Self>) -> <Self as Handler<SendMessage<R>>>::Result {
        if let NodeState::Running { ref mut sink } = self.state {
            let mut mp = Multipart::new();
            mp.push_back(::zmq::Message::from_slice(b"test").unwrap());
            mp.push_back(::zmq::Message::from_slice(b"").unwrap());
            mp.push_back(::zmq::Message::from_slice(b"Hello world").unwrap());
            let x = sink.send(mp).wait().unwrap();
        }
        return unsafe { std::mem::zeroed() };
    }
}


impl Node {
    pub fn new(remote: &str) -> Self {
        Node {
            state: NodeState::Created(remote.to_string())
        }
    }
}
