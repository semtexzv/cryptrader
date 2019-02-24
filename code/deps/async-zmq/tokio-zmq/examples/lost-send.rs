use std::sync::Arc;
use std::thread;

use crossbeam::channel;
use futures::{future::{ok, Future}, stream::Stream, sync::mpsc};
use tokio::runtime::current_thread;
use tokio_zmq::{prelude::*, Dealer, Multipart};
use zmq::Message;

fn main() {
    env_logger::init();
    let (request_sender, request_receiver) = channel::unbounded::<Multipart>();
    let (reply_sender, reply_receiver) = mpsc::unbounded::<Multipart>();

    let socket = Dealer::builder(Arc::new(zmq::Context::new()))
        .connect("tcp://localhost:9001")
        .build()
        .wait()
        .unwrap();
    let (sink, stream) = socket.sink_stream(8192).split();

    // worker
    for _ in 0..1 {
        let receiver = request_receiver.clone();
        let sender = reply_sender.clone();
        thread::spawn(move || {
            while let Ok(_) = receiver.recv() {
                let data = vec![1, 2, 3];
                let message = Message::from_slice(&data);
                let multipart = Multipart::from(vec![message]);
                sender.unbounded_send(multipart).unwrap();
            }
        });
    }

    // router
    let receive_process = stream
        .map(move |msg| {
            request_sender.send(msg).unwrap();
        })
        .for_each(|_| ok(()));

    let send_process = reply_receiver
        .map_err(|_| {
            panic!();
            #[allow(unreachable_code)]
            tokio_zmq::Error::Sink
        })
        .forward(sink);

    current_thread::Runtime::new()
        .unwrap()
        .spawn(receive_process.map_err(|_| panic!()))
        .spawn(send_process.map(|_| ()).map_err(|_| panic!()))
        .run()
        .unwrap();
}
