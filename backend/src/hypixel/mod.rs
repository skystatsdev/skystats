use crate::models;
use moka::future::Cache;
use once_cell::sync::Lazy;
use serde::de::DeserializeOwned;
use std::{
    sync::Arc,
    time::{Duration, Instant},
};
use thiserror::Error;
use tokio::sync::Mutex;
use uuid::Uuid;

pub struct Hypixel {
    client: reqwest::Client,
    key: String,
    rate_limiter: Mutex<RateLimiter>,
}

struct RateLimiter {
    remaining_limit: u64,
    time_till_reset: u64,
    time: Instant,
}

impl RateLimiter {
    pub async fn update(&mut self, headers: &reqwest::header::HeaderMap) {
        if let Some(remaining_limit) = headers
            .get("RateLimit-Remaining")
            .and_then(|header| header.to_str().ok())
            .and_then(|header| header.parse::<u64>().ok())
        {
            self.remaining_limit = remaining_limit;
        }

        if let Some(time_till_reset) = headers
            .get("RateLimit-Reset")
            .and_then(|header| header.to_str().ok())
            .and_then(|header| header.parse::<u64>().ok())
        {
            self.time_till_reset = time_till_reset;
        }
    }

    pub fn is_rate_limited(&self) -> bool {
        self.remaining_limit <= 1
            && self.time_till_reset > 0
            && self.time + Duration::from_secs(self.time_till_reset) > Instant::now()
    }

    pub fn get_time_till_reset(&self) -> u64 {
        std::cmp::max(
            0,
            ((self.time + Duration::from_secs(self.time_till_reset)) - Instant::now()).as_secs(),
        )
    }
}

#[derive(Error, Debug)]
pub enum HypixelError {
    #[error("reqwest error: {0}")]
    Reqwest(#[from] reqwest::Error),
    #[error("json error: {0}")]
    Json(#[from] serde_json::Error),
}

static HYPIXEL: Lazy<Hypixel> = Lazy::new(|| Hypixel {
    client: reqwest::Client::new(),
    key: std::env::var("HYPIXEL_API_KEY").unwrap(),
    rate_limiter: Mutex::new(RateLimiter {
        remaining_limit: 0,
        time_till_reset: 0,
        time: Instant::now(),
    }),
});

/// Do a request to the Hypixel API without handling caching.
async fn request<T: DeserializeOwned>(
    endpoint: &str,
    params: &[(&str, &str)],
) -> Result<T, HypixelError> {
    if HYPIXEL.rate_limiter.lock().await.is_rate_limited() {
        let time_till_reset = HYPIXEL.rate_limiter.lock().await.get_time_till_reset();
        println!("Sleeping for {time_till_reset} seconds");
        tokio::time::sleep(Duration::from_secs(time_till_reset)).await;
    }

    let res = HYPIXEL
        .client
        .get(format!("https://api.hypixel.net/{endpoint}"))
        .query(params)
        .header("API-Key", &HYPIXEL.key)
        .send()
        .await?;

    HYPIXEL
        .rate_limiter
        .lock()
        .await
        .update(res.headers())
        .await;

    Ok(res.json().await?)
}

static PLAYER_CACHE: Lazy<Cache<Uuid, Arc<models::hypixel::player::Player>>> = Lazy::new(|| {
    Cache::builder()
        .time_to_live(Duration::from_secs(60))
        .build()
});

pub async fn player(uuid: Uuid) -> Result<Arc<models::hypixel::player::Player>, HypixelError> {
    if let Some(player) = PLAYER_CACHE.get(&uuid) {
        return Ok(player);
    }

    let res = Arc::new(
        request::<models::hypixel::player::Player>("player", &[("uuid", &uuid.to_string())])
            .await?,
    );

    PLAYER_CACHE.insert(uuid, res.clone()).await;

    Ok(res)
}
