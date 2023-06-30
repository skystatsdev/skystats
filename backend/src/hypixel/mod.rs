use std::time::Duration;

use moka::future::Cache;
use once_cell::sync::Lazy;
use serde::de::DeserializeOwned;
use thiserror::Error;
use uuid::Uuid;

use crate::models;

#[derive(Clone)]
pub struct Hypixel {
    client: reqwest::Client,
    api_key: String,
}

#[derive(Error, Debug)]
pub enum HypixelError {
    #[error("reqwest error: {0}")]
    Reqwest(#[from] reqwest::Error),
    #[error("json error: {0}")]
    Json(#[from] serde_json::Error),
}

static HYPIXEL: Lazy<Hypixel> = Lazy::new(|| {
    let api_key = std::env::var("HYPIXEL_API_KEY").expect("HYPIXEL_API_KEY must be set");
    Hypixel {
        client: reqwest::Client::new(),
        api_key,
    }
});

/// Do a request to the Hypixel API without handling caching.
async fn request<T: DeserializeOwned>(
    endpoint: &str,
    params: &[(&str, &str)],
) -> Result<T, HypixelError> {
    let url =
        reqwest::Url::parse_with_params(&format!("https://api.hypixel.net/{endpoint}"), params)
            .expect("url should always be valid");

    let res = HYPIXEL
        .client
        .get(url)
        .header("API-Key", &HYPIXEL.api_key)
        .send()
        .await?;
    Ok(res.json().await?)
}

static PLAYER_CACHE: Lazy<Cache<Uuid, models::hypixel::player::Player>> = Lazy::new(|| {
    Cache::builder()
        .time_to_live(Duration::from_secs(60))
        .build()
});

pub async fn player(uuid: Uuid) -> Result<models::hypixel::player::Player, HypixelError> {
    if let Some(player) = PLAYER_CACHE.get(&uuid) {
        return Ok(player);
    }

    let res = request::<models::hypixel::player::Player>(
        "player",
        &[("uuid", uuid.to_string().as_str())],
    )
    .await?;

    PLAYER_CACHE.insert(uuid, res.clone()).await;

    Ok(res)
}
