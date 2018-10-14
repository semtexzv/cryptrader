use ::prelude::*;

use std::sync::mpsc::Sender as TSender;
use std::sync::mpsc::Receiver as TReceiver;
use std::sync::mpsc::channel;
use std::thread;

use ws::{CloseCode, connect};

pub enum Event {
    Connect(ws::Sender),
    Msg(String),
    Disconnect,
}

struct WsHandler {
    ws_out: ws::Sender,
    thread_out: TSender<Event>,
}

impl ws::Handler for WsHandler {
    fn on_open(&mut self, shake: ws::Handshake) -> StdResult<(), ws::Error> {
        self.thread_out
            .send(Event::Connect(self.ws_out.clone()))
            .map_err(|err| ws::Error::new(
                ws::ErrorKind::Internal,
                format!("Unable to communicate between threads: {:?}.", err)))
    }

    fn on_message(&mut self, msg: ws::Message) -> StdResult<(), ws::Error> {
        self.thread_out.send(Event::Msg(msg.to_string()))
            .map_err(|err| ws::Error::new(
                ws::ErrorKind::Internal,
                format!("Unable to communicate between threads: {:?}.", err)))
    }


    fn on_close(&mut self, code: CloseCode, reason: &str) {
        error!("Socket was closed");
        self.thread_out.send(Event::Disconnect)
            .map_err(|err| ws::Error::new(
                ws::ErrorKind::Internal,
                format!("Unable to communicate between threads: {:?}.", err))).unwrap();
        ::std::process::abort()
    }

    fn on_error(&mut self, err: ::ws::Error) {
        error!("Socket Encountered error");
        self.thread_out.send(Event::Disconnect)
            .map_err(|err| ws::Error::new(
                ws::ErrorKind::Internal,
                format!("Unable to communicate between threads: {:?}.", err))).unwrap();
        ::std::process::abort()
    }
    fn on_shutdown(&mut self) {
        error!("Socket was shut down");
        self.thread_out.send(Event::Disconnect)
            .map_err(|err| ws::Error::new(
                ws::ErrorKind::Internal,
                format!("Unable to communicate between threads: {:?}.", err))).unwrap();
        ::std::process::abort()
    }
    fn on_timeout(&mut self, event: ws::util::Token) -> StdResult<(),ws::Error> {
        error!("Socket timed out");
        self.thread_out.send(Event::Disconnect)
            .map_err(|err| ws::Error::new(
                ws::ErrorKind::Internal,
                format!("Unable to communicate between threads: {:?}.", err))).unwrap();
        ::std::process::abort()
    }
}

pub struct WsClient {
    pub rx: TReceiver<Event>,
    pub tx: ws::Sender,
}

impl WsClient {
    pub fn connect(url: &str) -> Result<WsClient> {
        let url = url.to_string();
        let (tx, rx) = channel();

        let handler = thread::spawn(move || {
            println!("Connecting to {}", url);
            let mut settings = ws::Settings::default();

            let mut socket = ws::Builder::new()
                .with_settings(settings)
                .build(|sender| {
                    WsHandler {
                        ws_out: sender,
                        thread_out: tx.clone(),
                    }
                }).unwrap();

            socket.connect(url::Url::parse(&url).unwrap()).unwrap();
            socket.run().unwrap();
        });

        match rx.recv() {
            Ok(Event::Connect(sender)) => {
                info!("Connected");
                return Ok(WsClient {
                    tx: sender,
                    rx,
                });
            }
            Ok(Event::Disconnect) => {
                bail!("Could not connect to websocket server")
            }
            _ => {
                bail!("Could not connect to websocket server, unknown")
            }
        }
    }
}