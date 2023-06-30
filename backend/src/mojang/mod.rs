use std::{sync::LazyLock, time::Duration};

use moka::future::Cache;
use serde::Deserialize;
use thiserror::Error;
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
    RequestError(#[from] reqwest::Error),
}

static UUID_TO_USERNAME_CACHE: LazyLock<Cache<Uuid, String>> = LazyLock::new(|| {
    Cache::builder()
        // 1 hour
        .time_to_live(Duration::from_secs(60 * 60))
        .build()
});
static LOWERCASE_USERNAME_TO_PROFILE_CACHE: LazyLock<Cache<String, Profile>> =
    LazyLock::new(|| {
        Cache::builder()
            .time_to_live(Duration::from_secs(60 * 60))
            .build()
    });

pub async fn profile_from_uuid(uuid: Uuid) -> Result<Profile, MojangError> {
    // already cached?
    if let Some(username) = UUID_TO_USERNAME_CACHE.get(&uuid) {
        return Ok(Profile {
            username: username.clone(),
            uuid,
        });
    }

    let url = format!("https://sessionserver.mojang.com/session/minecraft/profile/{uuid}");
    let response = reqwest::get(&url).await?;
    let profile = response.json::<Profile>().await?;

    // put it in both caches
    UUID_TO_USERNAME_CACHE
        .insert(uuid, profile.username.clone())
        .await;
    LOWERCASE_USERNAME_TO_PROFILE_CACHE
        .insert(profile.username.to_lowercase(), profile.clone())
        .await;

    Ok(profile)
}

pub async fn profile_from_username(username: &str) -> Result<Profile, MojangError> {
    // already cached?
    if let Some(profile) = LOWERCASE_USERNAME_TO_PROFILE_CACHE.get(&username.to_lowercase()) {
        return Ok(profile.clone());
    }

    let url = format!("https://api.mojang.com/users/profiles/minecraft/{username}");
    let response = reqwest::get(&url).await?;
    let profile = response.json::<Profile>().await?;

    // put it in both caches
    UUID_TO_USERNAME_CACHE
        .insert(profile.uuid, profile.username.clone())
        .await;
    LOWERCASE_USERNAME_TO_PROFILE_CACHE
        .insert(profile.username.to_lowercase(), profile.clone())
        .await;

    Ok(profile)
}

pub async fn profile_from_username_or_uuid(username_or_uuid: &str) -> Result<Profile, MojangError> {
    let uuid = Uuid::parse_str(username_or_uuid);
    match uuid {
        Ok(uuid) => profile_from_uuid(uuid).await,
        Err(_) => profile_from_username(username_or_uuid).await,
    }
}
