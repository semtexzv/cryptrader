use std::{
    collections::{
        vec_deque::{Drain, IntoIter, Iter, IterMut},
        VecDeque,
    },
    ops::RangeBounds,
};

use zmq;

#[derive(Debug)]
pub struct Multipart(pub(crate) VecDeque<zmq::Message>);

impl Multipart {
    pub fn new() -> Self {
        Multipart::default()
    }

    pub fn into_inner(self) -> VecDeque<zmq::Message> {
        self.0
    }

    pub fn get(&self, index: usize) -> Option<&zmq::Message> {
        self.0.get(index)
    }

    pub fn pop_front(&mut self) -> Option<zmq::Message> {
        self.0.pop_front()
    }

    pub fn pop_back(&mut self) -> Option<zmq::Message> {
        self.0.pop_back()
    }

    pub fn push_front(&mut self, msg: zmq::Message) {
        self.0.push_front(msg)
    }

    pub fn push_back(&mut self, msg: zmq::Message) {
        self.0.push_back(msg)
    }

    pub fn is_empty(&self) -> bool {
        self.0.is_empty()
    }

    pub fn iter(&self) -> Iter<zmq::Message> {
        self.0.iter()
    }

    pub fn len(&self) -> usize {
        self.0.len()
    }

    pub fn iter_mut(&mut self) -> IterMut<zmq::Message> {
        self.0.iter_mut()
    }

    pub fn drain<R>(&mut self, range: R) -> Drain<zmq::Message>
        where
            R: RangeBounds<usize>,
    {
        self.0.drain(range)
    }
}

impl Default for Multipart {
    fn default() -> Self {
        Multipart(VecDeque::new())
    }
}

impl From<zmq::Message> for Multipart {
    fn from(msg: zmq::Message) -> Self {
        let mut multipart = Multipart::new();
        multipart.push_back(msg);
        multipart
    }
}

impl From<Vec<zmq::Message>> for Multipart {
    fn from(v: Vec<zmq::Message>) -> Self {
        Multipart(v.into())
    }
}

impl<'a> IntoIterator for &'a Multipart {
    type Item = &'a zmq::Message;
    type IntoIter = Iter<'a, zmq::Message>;

    fn into_iter(self) -> Iter<'a, zmq::Message> {
        self.iter()
    }
}

impl IntoIterator for Multipart {
    type Item = zmq::Message;
    type IntoIter = IntoIter<zmq::Message>;

    fn into_iter(self) -> IntoIter<zmq::Message> {
        self.0.into_iter()
    }
}

impl<'a> IntoIterator for &'a mut Multipart {
    type Item = &'a mut zmq::Message;
    type IntoIter = IterMut<'a, zmq::Message>;

    fn into_iter(self) -> IterMut<'a, zmq::Message> {
        self.iter_mut()
    }
}
