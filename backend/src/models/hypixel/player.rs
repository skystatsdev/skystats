use std::collections::HashMap;

use serde::Deserialize;
use uuid::Uuid;

#[derive(Deserialize, Clone)]
pub struct Player {
    pub success: bool,
    pub player: PlayerData,
}

#[derive(Deserialize, Clone)]
pub struct PlayerData {
    pub uuid: Uuid,
    pub stats: PlayerStats,

    #[serde(flatten)]
    pub other: HashMap<String, serde_json::Value>,
}

#[derive(Deserialize, Clone)]
pub struct PlayerStats {
    #[serde(rename = "SkyBlock")]
    pub skyblock: PlayerSkyBlock,
}

#[derive(Deserialize, Clone)]
pub struct PlayerSkyBlock {
    pub profiles: HashMap<Uuid, PlayerSkyBlockProfile>,
}

#[derive(Deserialize, Clone)]
pub struct PlayerSkyBlockProfile {
    pub profile_id: Uuid,
    pub cute_name: String,
}
