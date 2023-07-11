use std::collections::HashMap;

use serde::Deserialize;
use uuid::Uuid;

#[derive(Deserialize)]
pub struct Player {
    pub success: bool,
    pub player: Option<PlayerData>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PlayerData {
    pub uuid: Uuid,
    #[serde(default)]
    pub stats: PlayerStats,

    #[serde(default)]
    pub prefix: Option<String>,
    #[serde(default)]
    pub rank: Option<String>,
    #[serde(default)]
    pub monthly_package_rank: Option<String>,
    #[serde(default)]
    pub new_package_rank: Option<String>,
    #[serde(default)]
    pub package_rank: Option<String>,

    #[serde(default)]
    pub monthly_rank_color: Option<String>,
    #[serde(default)]
    pub rank_plus_color: Option<String>,
    #[serde(default)]
    pub most_recent_monthly_package_rank: Option<String>,
    #[serde(default)]
    pub build_team: bool,
    #[serde(default)]
    pub build_team_admin: bool,

    #[serde(flatten)]
    pub other: HashMap<String, serde_json::Value>,
}

#[derive(Deserialize, Default)]
pub struct PlayerStats {
    #[serde(rename = "SkyBlock")]
    #[serde(default)]
    pub skyblock: PlayerSkyBlock,
}

#[derive(Deserialize, Default)]
pub struct PlayerSkyBlock {
    pub profiles: HashMap<Uuid, PlayerSkyBlockProfile>,
}

#[derive(Deserialize)]
pub struct PlayerSkyBlockProfile {
    pub profile_id: Uuid,
    pub cute_name: String,
}
