#![feature(trait_alias)]
#![feature(box_syntax)]
#![feature(type_alias_impl_trait)]
#![feature(arbitrary_self_types)]

use std::sync::Arc;
use std::marker::PhantomData;
use std::collections::HashMap;

use serde::{Serialize, Deserialize, de::DeserializeOwned};

use ak::*;
use ak::addr::*;
use futures::{TryStreamExt, StreamExt};
use futures::async_await::pending_once;
use tokio::future::FutureExt;
use std::time::Duration;

pub async fn connect(name: impl Into<String>, addr: impl Into<String>) -> nats::Client {
    let addr = addr.into().parse().unwrap();
    let client = nats::Client::new(vec![addr]);

    client.connect_mut().await.name(name.into());
    client.connect().await;

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
    type Result = String;
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
    type Result = Result<M::Result, ()>;
}


pub(crate) struct ClientWorker {
    client: nats::Client,
}

impl Actor for ClientWorker {}


impl<T: RemoteMessage> Handler<Subscribe<T>> for ClientWorker {
    type Future = impl Future<Output=String> + 'static;

    fn handle(mut self: ContextRef<Self>, msg: Subscribe<T>) -> Self::Future {
        use futures::stream::StreamExt;

        println!("Subscribing");
        let client = self.client.clone();

        async move {
            let mut sub = msg.name.parse().unwrap();
            let (sid, src) = client.subscribe(&sub, 2).await.unwrap();

            let folder = move |(client, rec): (nats::Client, Recipient<T>), i: nats::Msg| async move {
                println!("Sub msg received");
                let mut req_data = json::from_slice(i.payload()).expect("Msg deserialization");
                if let Some(reply_to) = i.reply_to() {
                    let mut response = rec.send(req_data).await.unwrap();
                    let data = json::to_vec(&response).expect("response serialization");

                    client.publish(reply_to, &data).await;
                    (client, rec)
                } else {
                    rec.send(req_data).await.unwrap();
                    (client, rec)
                }
            };

            let finished = src.fold((client, msg.rec), folder);

            self.spawn(|this| async {
                println!("Spawning folder");
                finished.await;
            });

            format!("{}", sid)
        }
    }
}

impl<T: RemoteMessage> Handler<Publish<T>> for ClientWorker {
    type Future = impl Future<Output=Result<T::Result, ()>>;

    fn handle(mut self: ContextRef<Self>, msg: Publish<T>) -> Self::Future {
        let client = self.client.clone();
        async move {
            println!("Handling send msg");
            let subject = msg.subject.parse().unwrap();
            let rep = format!("{}-{}", subject, nuid::next()).parse().unwrap();
            let data = json::to_vec(&msg.data).unwrap();
            let sid = nuid::next();
            println!("Handling send msg");
            let _ = client.publish(&subject, &data).await;

            if msg.is_req {
                let (sid, recvr) = client.subscribe(&rep, 2).await.unwrap();
                client.unsubscribe_with_max_msgs(sid, 1).await.unwrap();

                match recvr.into_future().timeout(Duration::from_secs(1)).await {
                    Ok((Some(rep), _)) => {
                        let reply: T::Result = json::from_slice(&rep.payload()).unwrap();
                        return Ok(reply);
                    }
                    Ok((None, _)) | Err(_) => {
                        panic!("Returning error, stream closed");
                        return Err(());
                    }
                }
            } else {
                client.publish(&subject, data.as_ref()).await.expect("Publish");
                return Err(());
            }
        }
    }
}

#[derive(Clone)]
pub struct Client {
    addr: Addr<ClientWorker>
}

impl Client {
    pub async fn new(addr: impl Into<String>) -> Self {
        let client = connect(nuid::next(), addr).await;
        let addr = Actor::start(|addr| {
            ClientWorker {
                client,
            }
        });
        Client { addr }
    }

    pub fn subscribe<T>(&self, topic: impl Into<String>, queue: impl Into<Option<String>>, addr: Recipient<T>)
                        -> impl Future<Output=()> + 'static
        where
            T: RemoteMessage + Send
    {
        let fut = self.addr.send(Subscribe::new(topic, queue, addr));

        async { fut.await.unwrap(); }
    }

    pub fn publish<T>(&self, topic: impl Into<String>, data: T)
                      -> impl Future<Output=()> + 'static
        where T: RemoteMessage
    {
        let fut = self.addr.send(Publish { data, subject: topic.into(), is_req: false });
        async {
            println!("Awaiting send future");
            let _ = fut.await;
        }
    }

    pub fn request<T>(&self, topic: impl Into<String>, data: T)
                      -> impl Future<Output=Result<T::Result, ()>>
        where T: RemoteMessage
    {
        let addr = self.addr.clone();
        let topic = topic.into();
        let sent = addr.send(Publish { data, subject: topic, is_req: true });

        async {
            sent.await.unwrap()
        }
    }
}