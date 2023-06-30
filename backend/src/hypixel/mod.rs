use std::sync::LazyLock;

use serde::de::DeserializeOwned;
use thiserror::Error;

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

static HYPIXEL: LazyLock<Hypixel> = LazyLock::new(|| {
    let api_key = std::env::var("HYPIXEL_API_KEY").expect("HYPIXEL_API_KEY must be set");
    Hypixel {
        client: reqwest::Client::new(),
        api_key,
    }
});

/// Do a request to the Hypixel API without handling caching.
pub async fn request<T: DeserializeOwned>(
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
