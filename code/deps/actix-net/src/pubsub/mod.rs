use crate::prelude::*;
use crate::base::{
    comm::{
        ZMQ_CTXT,
        BaseCommunicator,
    },
};
use futures::{
    sync::oneshot::Sender,
    sync::mpsc::{
        UnboundedSender,
        UnboundedReceiver,
        unbounded,
    },
};


pub struct Publisher {
    uuid: Uuid,
    sender: UnboundedSender<Multipart>,
}

impl Actor for Publisher {
    type Context = Context<Self>;
}

impl Publisher {
    fn socket_on(uuid: &Uuid, addr: &str) -> Result<Pub, tzmq::Error> {
        Pub::builder(ZMQ_CTXT.clone())
            .identity(uuid.as_bytes())
            .bind(&addr)
            .build()
    }
    fn socket_to(uuid: &Uuid, addr: &str) -> Result<Pub, tzmq::Error> {
        Pub::builder(ZMQ_CTXT.clone())
            .identity(uuid.as_bytes())
            .connect(&addr)
            .build()
    }

    fn new(comm: &BaseCommunicator, addr: &str, on: bool) -> Result<Addr<Self>, failure::Error> {
        let uuid = comm.uuid;

        let socket = if on {
            Self::socket_on(&uuid, addr)
        } else {
            Self::socket_to(&uuid, addr)
        }?;

        let sink = socket.sink();


        let (tx, rx) = unbounded();

        let forwarder = sink.send_all(rx.map_err(|_| tzmq::Error::Sink)).map(|_| {});

        return Ok(Publisher::create(move |ctx| {
            ctx.spawn(wrap_future(forwarder).drop_err());

            Publisher {
                uuid,
                sender: tx,
            }
        }));
        /*
        Ok(Arbiter::start(move |ctx: &mut Context<BaseCommunicator>| {
            BaseCommunicator {
                uuid,
                registry: HashMap::new(),
                router_sink: tx,
                nodes: HashMap::new(),
                node_names: HashMap::new(),
            }
        }))
        */
    }
}