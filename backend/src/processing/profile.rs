use uuid::Uuid;

use crate::{hypixel, models::profile::ProfileMember, processing, routes::ApiError};

pub async fn profile(player_uuid: Uuid, profile_uuid: Uuid) -> Result<ProfileMember, ApiError> {
    let player = processing::player::player(player_uuid).await?;
    let res = hypixel::profiles(player_uuid).await?;

    let profile = res
        .profiles
        .iter()
        .find(|profile| profile.profile_id == profile_uuid)
        .ok_or(ApiError::ProfileNotFound {
            username: player.base.username.clone(),
            profile: profile_uuid.to_string(),
        })?;

    let member = profile
        .members
        .get(&player_uuid)
        .ok_or(ApiError::ProfileNotFound {
            username: player.base.username.clone(),
            profile: profile_uuid.to_string(),
        })?;

    Ok(ProfileMember {
        player: player.base,
        fairy_souls: member.fairy_souls_collected,
    })
}
