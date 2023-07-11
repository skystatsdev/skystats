use std::time::Duration;

use moka::future::Cache;
use once_cell::sync::Lazy;
use reqwest::StatusCode;
use serde::Deserialize;
use thiserror::Error;
use tracing::info;
use uuid::Uuid;

#[derive(Deserialize, Clone, Debug)]
pub struct Profile {
    #[serde(rename = "name")]
    pub username: String,
    #[serde(rename = "id")]
    pub uuid: Uuid,
}

#[derive(Error, Debug)]
pub enum MojangError {
    #[error(transparent)]
    Request(#[from] reqwest::Error),
    #[error(transparent)]
    Json(#[from] serde_json::Error),

    #[error("Unknown player")]
    PlayerNotFound,
}

static UUID_TO_USERNAME_CACHE: Lazy<Cache<Uuid, String>> = Lazy::new(|| {
    Cache::builder()
        // 1 hour
        .time_to_live(Duration::from_secs(60 * 60))
        .build()
});
static LOWERCASE_USERNAME_TO_PROFILE_CACHE: Lazy<Cache<String, Profile>> = Lazy::new(|| {
    Cache::builder()
        .time_to_live(Duration::from_secs(60 * 60))
        .build()
});

pub async fn profile_from_uuid(uuid: Uuid) -> Result<Profile, MojangError> {
    // already cached?
    if let Some(username) = UUID_TO_USERNAME_CACHE.get(&uuid) {
        return Ok(Profile { username, uuid });
    }

    mojang_request(&format!(
        "https://sessionserver.mojang.com/session/minecraft/profile/{uuid}"
    ))
    .await
}

pub async fn profile_from_username(username: &str) -> Result<Profile, MojangError> {
    // already cached?
    if let Some(profile) = LOWERCASE_USERNAME_TO_PROFILE_CACHE.get(&username.to_lowercase()) {
        return Ok(profile);
    }

    mojang_request(&format!(
        "https://api.mojang.com/users/profiles/minecraft/{username}"
    ))
    .await
}

#[tracing::instrument]
async fn mojang_request(url: &str) -> Result<Profile, MojangError> {
    info!("Begin");
    let profile_res = reqwest::get(url).await?;
    if profile_res.status() == StatusCode::NOT_FOUND {
        return Err(MojangError::PlayerNotFound);
    }

    let profile = profile_res.json::<Profile>().await?;

    // put it in both caches
    UUID_TO_USERNAME_CACHE
        .insert(profile.uuid, profile.username.clone())
        .await;
    LOWERCASE_USERNAME_TO_PROFILE_CACHE
        .insert(profile.username.to_lowercase(), profile.clone())
        .await;

    info!("End");
    Ok(profile)
}

pub async fn profile_from_username_or_uuid(username_or_uuid: &str) -> Result<Profile, MojangError> {
    match Uuid::parse_str(username_or_uuid) {
        Ok(uuid) => profile_from_uuid(uuid).await,
        Err(_) => profile_from_username(username_or_uuid).await,
    }
}
