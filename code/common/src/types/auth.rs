use crate::prelude::*;

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct AuthInfo {
    pub key: String,
    pub secret: String,
}