use std::collections::HashMap;

use serde::Deserialize;
use uuid::Uuid;

#[derive(Deserialize)]
pub struct Player {
    pub success: bool,
    pub player: PlayerData,
}

#[derive(Deserialize)]
pub struct PlayerData {
    pub uuid: Uuid,
    pub stats: PlayerStats,

    #[serde(flatten)]
    pub other: HashMap<String, serde_json::Value>,
}

#[derive(Deserialize)]
pub struct PlayerStats {
    #[serde(rename = "SkyBlock")]
    pub skyblock: PlayerSkyBlock,
}

#[derive(Deserialize)]
pub struct PlayerSkyBlock {
    pub profiles: HashMap<Uuid, PlayerSkyBlockProfile>,
}

#[derive(Deserialize)]
pub struct PlayerSkyBlockProfile {
    pub profile_id: Uuid,
    pub cute_name: String,
}
