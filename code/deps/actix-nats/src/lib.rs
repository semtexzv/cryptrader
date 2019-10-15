#![feature(trait_alias)]
#![feature(box_syntax)]

use std::sync::Arc;
use std::marker::PhantomData;
use std::collections::HashMap;

use serde::{Serialize, de::DeserializeOwned};
use actix::prelude::*;
use nats::nats_client::{NatsClient, NatsClientOptions};
use futures03::compat::Future01CompatExt;
use futures03::{TryFutureExt, FutureExt};
use futures::future::Future as _;
use futures::stream::Stream as _;

pub async fn connect(name: impl Into<String>, addr: impl Into<String>) -> Arc<NatsClient> {
    let options = NatsClientOptions::builder()
        .cluster_uris(vec!(addr.into()))
        .build()
        .unwrap();

    let client = NatsClient::from_options(options).compat().await.unwrap();
    NatsClient::connect(&client).compat().await.unwrap();

    client
}


pub trait RemoteMessage = Message + 'static + Serialize + DeserializeOwned + Send + Sync + std::fmt::Debug
    where <Self as Message>::Result: DeserializeOwned + Serialize + Send + Sync + 'static;


pub(crate) struct Subscribe<T: RemoteMessage> {
    name: String,
    group: Option<String>,
    rec: Recipient<T>,
    _p: PhantomData<T>,
}

impl<T: RemoteMessage> Message for Subscribe<T> {
    type Result = Result<String, ()>;
}

impl<T: RemoteMessage + 'static> Subscribe<T> {
    fn new(name: impl Into<String>, group: impl Into<Option<String>>, addr: Recipient<T>) -> Self {
        Subscribe {
            name: name.into(),
            group: group.into(),
            rec: addr,
            _p: PhantomData,
        }
    }
}


pub struct Publish<M: RemoteMessage> {
    data: M,
    subject: String,
    is_req: bool,
}

impl<M: RemoteMessage> Message for Publish<M> {
    type Result = Result<M::Result, MailboxError>;
}


pub(crate) struct ClientWorker {
    client: Arc<NatsClient>,
    subs: HashMap<String, SpawnHandle>,
}

impl actix::Actor for ClientWorker {
    type Context = Context<Self>;
}


impl<T: RemoteMessage> Handler<Subscribe<T>> for ClientWorker {
    type Result = Result<String, ()>;

    fn handle(&mut self, msg: Subscribe<T>, ctx: &mut Self::Context) -> Self::Result {
        let client = self.client.clone();
        let recipient = msg.rec.clone();

        let sid = nuid::next();
        let sub = nats::ops::Subscribe::builder()
            .subject(msg.name)
            .sid(sid.clone())
            .queue_group(msg.group)
            .build().unwrap();

        use futures::future::ok;


        let folder = move |(client, rec): (Arc<NatsClient>, Recipient<T>), i: nats::ops::Message| -> Box<futures::future::Future<Item=_,Error=_>> {
            let req = json::from_slice(&i.payload).expect("Msg deserialization");
            //println!("Sub recvd : {:?} => {:?} ", i, req);
            if let Some(reply_to) = i.reply_to {
                let res = rec.send(req);
                box res.map_err(|e| nats::error::RatsioError::GenericError("Mailbox".to_string())).and_then(|reply_data| {
                    let data = json::to_vec(&reply_data).expect("Msg serialization");

                    let pub_reply = nats::ops::Publish::builder()
                        .subject(reply_to)
                        .payload(data)
                        .build().expect("Publish builder");

                    client.publish(pub_reply)
                        .map(|_| (client, rec))
                })
            } else {
                rec.do_send(req).unwrap();
                box ok((client, rec))
            }
        };

        let handle = ctx.spawn(self.client.subscribe(sub)
            .and_then(move |stream| {
                stream.fold((client, recipient), folder)
            })
            .map(|_| ())
            .map_err(|e| panic!("{:?}", e))
            .into_actor(self));

        self.subs.insert(sid.clone(), handle);
        Ok(sid)
    }
}

impl<T: RemoteMessage> Handler<Publish<T>> for ClientWorker {
    type Result = ResponseActFuture<Self, T::Result, MailboxError>;

    fn handle(&mut self, msg: Publish<T>, _ctx: &mut Self::Context) -> Self::Result {
        let client = self.client.clone();
        Box::new(async move {
            let subject = msg.subject.parse().unwrap();
            let rep = format!("{}-{}", subject, nuid::next());
            let data = json::to_vec(&msg.data).unwrap();
            let sid = nuid::next();

            let publish = nats::ops::Publish::builder()
                .reply_to(if msg.is_req { Some(rep.clone()) } else { None })
                .subject(subject)
                .payload(data)
                .build()
                .unwrap();

            if msg.is_req {
                let sub = nats::ops::Subscribe::builder()
                    .subject(rep)
                    .sid(sid.clone())
                    .build().unwrap();

                let unsub = nats::ops::UnSubscribe::builder()
                    .sid(sid)
                    .max_msgs(Some(2))
                    .build().unwrap();

                let stream = client.subscribe(sub).compat().await.expect("Subscribe");
                client.unsubscribe(unsub).compat().await.expect("Unsubscribe");
                client.publish(publish).compat().await.expect("Publish");
                match futures::stream::Stream::into_future(stream).compat().await {
                    Ok((Some(reply), _)) => {
                        //println!("Returning value");
                        let reply: T::Result = json::from_slice(&reply.payload).unwrap();
                        Ok(reply)
                    }
                    Ok((None, _)) => {
                        println!("Returning error, stream closed");
                        Err(MailboxError::Closed)
                    }
                    Err((e, _)) => {
                        println!("Returning error, reply closed : {:?}", e);
                        Err(MailboxError::Closed)
                    }
                }
            } else {
                let res = client.publish(publish).compat().await.expect("Publish");
                //println!("Returning error because this is only a notification");
                //Err(nats::error::RatsioError::GenericError("Bla".to_string()))
                Err(MailboxError::Closed)
            }
        }.boxed_local().compat().into_actor(self))
    }
}


#[derive(Clone)]
pub struct Client {
    addr: Addr<ClientWorker>
}

use futures::{
    BoxFuture,
    future::result,
};

impl Client {
    pub async fn new(addr: impl Into<String>) -> Self {
        let client = connect(nuid::next(), addr).await;
        let addr = Actor::create(|_ctx| {
            ClientWorker {
                client,
                subs: HashMap::new(),
            }
        });
        Client { addr }
    }

    pub fn subscribe<T>(&self, topic: impl Into<String>, queue: impl Into<Option<String>>, addr: Recipient<T>)
        where
            T: RemoteMessage + Send
    {
        let _ = self.addr.do_send(Subscribe::new(topic, queue, addr));
    }

    pub fn publish<T>(&self, topic: impl Into<String>, data: T)
        where T: RemoteMessage
    {
        let _ = self.addr.do_send(Publish { data, subject: topic.into(), is_req: false });
    }

    pub fn request<T>(&self, topic: impl Into<String>, data: T) -> Box<dyn futures::future::Future<Item=T::Result, Error=MailboxError>>
        where T: RemoteMessage
    {
        let addr = self.addr.clone();
        let topic = topic.into();
        let sent: BoxFuture<Result<T::Result, MailboxError>, MailboxError> = box addr.send(Publish { data, subject: topic, is_req: true });

        box sent.and_then(|r| result(r))
    }
}