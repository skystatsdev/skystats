use axum::{extract::Path, routing::get, Json, Router};
use uuid::Uuid;

use crate::{models::profile::ProfileMember, mojang, processing, routes::ApiError};

use super::{RouterResponse, SkyResult};

pub fn route() -> RouterResponse {
    Router::new().route("/:player/:profile", get(profile))
}

async fn profile(
    Path((player_uuid_or_username, profile_uuid_or_name)): Path<(String, String)>,
) -> SkyResult<Json<ProfileMember>> {
    let mojang_profile = mojang::profile_from_username_or_uuid(&player_uuid_or_username).await?;

    // get profile uuid
    let profile_uuid = match Uuid::parse_str(&profile_uuid_or_name) {
        Ok(profile_uuid_or_name) => profile_uuid_or_name,
        Err(_) => {
            let player = processing::player::player(mojang_profile.uuid).await?;
            let profile =
                player.skyblock.profiles.iter().find(|profile| {
                    profile.name.to_lowercase() == profile_uuid_or_name.to_lowercase()
                });
            let profile = profile.ok_or(ApiError::ProfileNotFound {
                username: mojang_profile.username,
                profile: profile_uuid_or_name.to_owned(),
            })?;
            profile.uuid
        }
    };

    Ok(Json(
        processing::profile::profile(mojang_profile.uuid, profile_uuid).await?,
    ))
}
