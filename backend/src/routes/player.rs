use axum::{extract::Path, routing::get, Extension, Json, Router};
use uuid::Uuid;

use crate::{
    models::{player::Player, profile::ProfileMember},
    mojang, processing, Context,
};

use super::{ApiError, RouterResponse, SkyResult};

pub fn route() -> RouterResponse {
    Router::new()
        .route("/:player", get(player))
        .route("/:player/:profile", get(player_profile))
}

async fn player(Path(uuid_or_username): Path<String>) -> SkyResult<Json<Player>> {
    let mojang_profile = mojang::profile_from_username_or_uuid(&uuid_or_username).await?;

    Ok(Json(processing::player::player(mojang_profile.uuid).await?))
}

async fn player_profile(
    mut ctx: Extension<Context>,
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
        processing::profile::profile(&mut ctx, mojang_profile.uuid, profile_uuid).await?,
    ))
}
