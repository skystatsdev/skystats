use crate::models;
use moka::future::Cache;
use once_cell::sync::Lazy;
use parking_lot::Mutex;
use serde::de::DeserializeOwned;
use std::{
    sync::Arc,
    time::{Duration, Instant},
};
use thiserror::Error;
use tracing::info;
use uuid::Uuid;

pub struct Hypixel {
    client: reqwest::Client,
    key: String,
    rate_limiter: Mutex<RateLimiter>,
}

struct RateLimiter {
    remaining_limit: u64,
    next_reset: Instant,
}

impl RateLimiter {
    pub fn update(&mut self, headers: &reqwest::header::HeaderMap) {
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
            self.next_reset = Instant::now() + Duration::from_secs(time_till_reset);
        }
    }

    pub fn is_rate_limited(&self) -> bool {
        self.remaining_limit <= 1 && self.next_reset > Instant::now()
    }

    pub fn get_time_till_reset(&self) -> Duration {
        std::cmp::max(
            Duration::ZERO,
            self.next_reset.duration_since(Instant::now()),
        )
    }
}

#[derive(Error, Debug)]
pub enum HypixelError {
    #[error(transparent)]
    Reqwest(#[from] reqwest::Error),
    #[error("json error: {0}")]
    Json(#[from] serde_json::Error),
    #[error(transparent)]
    ApiError(#[from] models::hypixel::HypixelApiError),
}

static HYPIXEL: Lazy<Hypixel> = Lazy::new(|| Hypixel {
    client: reqwest::Client::new(),
    key: std::env::var("HYPIXEL_API_KEY").unwrap(),
    rate_limiter: Mutex::new(RateLimiter {
        remaining_limit: 0,
        next_reset: Instant::now(),
    }),
});

/// Do a request to the Hypixel API without handling caching.
#[tracing::instrument]
async fn request<T: DeserializeOwned>(
    endpoint: &str,
    params: &[(&str, &str)],
) -> Result<T, HypixelError> {
    info!("Begin");
    if HYPIXEL.rate_limiter.lock().is_rate_limited() {
        let time_till_reset = HYPIXEL.rate_limiter.lock().get_time_till_reset();
        info!("Ratelimited, sleeping for {time_till_reset:?}");
        tokio::time::sleep(time_till_reset).await;
    }

    let res = HYPIXEL
        .client
        .get(format!("https://api.hypixel.net/{endpoint}"))
        .query(params)
        .header("API-Key", &HYPIXEL.key)
        .send()
        .await?;

    HYPIXEL.rate_limiter.lock().update(res.headers());

    let res = res.json::<serde_json::Value>().await?;
    info!("End");

    // if it looks like an error, return it
    if let Ok(error) = serde_json::from_value::<models::hypixel::HypixelApiError>(res.clone()) {
        return Err(HypixelError::ApiError(error));
    };
    serde_json::from_value::<T>(res).map_err(HypixelError::Json)
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

static PROFILES_CACHE: Lazy<Cache<Uuid, Arc<models::hypixel::profiles::Profiles>>> =
    Lazy::new(|| {
        Cache::builder()
            .time_to_live(Duration::from_secs(60))
            .build()
    });
pub async fn profiles(
    uuid: Uuid,
) -> Result<Arc<models::hypixel::profiles::Profiles>, HypixelError> {
    if let Some(profiles) = PROFILES_CACHE.get(&uuid) {
        return Ok(profiles);
    }

    let res = Arc::new(
        request::<models::hypixel::profiles::Profiles>(
            "skyblock/profiles",
            &[("uuid", uuid.to_string().as_str())],
        )
        .await?,
    );

    PROFILES_CACHE.insert(uuid, res.clone()).await;

    Ok(res)
}
