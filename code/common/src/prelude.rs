pub use std::{
    rc::Rc,
    ops::{Deref, DerefMut},
    borrow::Cow,
    sync::Arc,
    fmt::{self, Debug},
    collections::{
        HashMap, BTreeMap,
        HashSet, BTreeSet,
    },
    marker::PhantomData,
    time::Instant,
};

pub use lazy_static::lazy_static;

pub use serde_derive::{Serialize, Deserialize};
pub use serde::{
    Serialize, Deserialize, de::DeserializeOwned,
};

pub use actix::prelude::*;


pub use actix::{
    fut::{
        self as afut,
        wrap_future,
        wrap_stream,
    }
};

pub use url::Url;
pub use log::{log, trace, debug, info, warn, error};
pub use bytes::{Bytes, BytesMut};

pub use failure::{bail, format_err, Error};
pub use failure_derive::Fail;


pub use futures::{
    future as fut,
    Future,
    prelude::*,
};

pub use std::result::Result as StdResult;

