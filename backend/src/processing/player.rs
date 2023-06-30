use std::collections::HashMap;

use uuid::Uuid;

use crate::{
    hypixel,
    models::player::{BasePlayer, Player, PlayerSkyBlock},
    mojang,
    routes::ApiError,
};

pub async fn player(uuid: Uuid) -> Result<Player, ApiError> {
    let mojang_profile_task = tokio::spawn(mojang::profile_from_uuid(uuid));
    let res = hypixel::player(uuid).await?;
    let mojang_profile = mojang_profile_task.await.unwrap()?;

    let mut profile_names = HashMap::new();
    for profile in res.player.stats.skyblock.profiles.values() {
        profile_names.insert(profile.profile_id, profile.cute_name.clone());
    }

    Ok(Player {
        base: BasePlayer {
            uuid: mojang_profile.uuid,
            username: mojang_profile.username,
        },
        skyblock: PlayerSkyBlock { profile_names },
    })
}
