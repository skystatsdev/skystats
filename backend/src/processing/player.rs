use uuid::Uuid;

use crate::{
    hypixel,
    models::player::{BasePlayer, Player, PlayerProfileInfo, PlayerSkyBlock},
    mojang,
    routes::ApiError,
};

pub async fn player(uuid: Uuid) -> Result<Player, ApiError> {
    let mojang_profile_task = tokio::spawn(mojang::profile_from_uuid(uuid));
    // let player_task = tokio::spawn(hypixel::player(uuid));
    let profiles_res = hypixel::profiles(uuid).await?;

    let mojang_profile = mojang_profile_task.await.unwrap()?;
    // let player_res = player_task.await.unwrap()?;

    let mut selected_profile = None;
    let mut profiles = Vec::new();
    for profile in &profiles_res.profiles {
        profiles.push(PlayerProfileInfo {
            uuid: profile.profile_id,
            name: profile.cute_name.clone(),
        });
        if profile.selected {
            selected_profile = Some(profile.profile_id);
        }
    }

    Ok(Player {
        base: BasePlayer {
            uuid: mojang_profile.uuid,
            username: mojang_profile.username,
        },
        skyblock: PlayerSkyBlock {
            profiles,
            selected_profile,
        },
    })
}
