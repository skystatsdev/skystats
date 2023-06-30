use std::collections::HashMap;

use uuid::Uuid;

use crate::{
    hypixel,
    models::{
        self,
        player::{Player, PlayerSkyBlock},
    },
    mojang,
    process::ProcessError,
};

pub async fn player(uuid: Uuid) -> Result<Player, ProcessError> {
    let mojang_profile_task = tokio::spawn(mojang::profile_from_uuid(uuid));
    let res = hypixel::request::<models::hypixel::player::Player>(
        "player",
        &[("uuid", uuid.to_string().as_str())],
    )
    .await
    .unwrap();
    let mojang_profile = mojang_profile_task.await.unwrap()?;

    let mut profile_names = HashMap::new();
    for profile in res.player.stats.skyblock.profiles.values() {
        profile_names.insert(profile.profile_id, profile.cute_name.clone());
    }

    Ok(Player {
        uuid: mojang_profile.uuid,
        username: mojang_profile.username,
        skyblock: PlayerSkyBlock { profile_names },
    })
}
