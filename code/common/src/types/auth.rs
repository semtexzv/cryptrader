use crate::prelude::*;

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct AuthInfo {
    pub key: String,
    pub secret: String,
}

impl AuthInfo {
    pub fn new(key: impl Into<String>, secret: impl Into<String>) -> Self {
        Self {
            key: key.into(),
            secret: secret.into(),
        }
    }
}