use actix_web::{get, web, Responder};
use uuid::Uuid;

use crate::{mojang, processing, routes::ApiError};

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("profile").service(profile));
}

#[get("{user}/{profile}")]
async fn profile(path: web::Path<(String, String)>) -> Result<impl Responder, ApiError> {
    let (player_uuid_or_username, profile_uuid_or_name) = path.into_inner();

    let mojang_profile = mojang::profile_from_username_or_uuid(&player_uuid_or_username).await?;

    // get profile uuid
    let profile_uuid = match Uuid::parse_str(&profile_uuid_or_name) {
        Ok(profile_uuid_or_name) => profile_uuid_or_name,
        Err(_) => {
            let player = processing::player::player(mojang_profile.uuid).await?;
            let profile = player
                .skyblock
                .profile_names
                .iter()
                .find(|(_, name)| name.to_lowercase() == profile_uuid_or_name.to_lowercase());
            let (profile_uuid, _) = profile.ok_or(ApiError::ProfileNotFound {
                username: mojang_profile.username,
                profile: profile_uuid_or_name,
            })?;
            *profile_uuid
        }
    };

    Ok(web::Json(
        processing::profile::profile(mojang_profile.uuid, profile_uuid).await?,
    ))
}
