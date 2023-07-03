//! Serde models for the Hypixel API.

use serde::Deserialize;
use thiserror::Error;

pub mod inventory;
pub mod player;
pub mod profiles;

#[derive(Deserialize, Error, Debug)]
#[error("{cause}")]
pub struct HypixelApiError {
    pub success: bool,
    pub cause: String,
}

#[derive(Deserialize)]
#[serde(untagged)]
pub enum HypixelApiResult<T> {
    Success(T),
    Error(HypixelApiError),
}
