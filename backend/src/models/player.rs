use serde::Serialize;
use uuid::Uuid;

use super::profile::GameMode;

#[derive(Serialize)]
pub struct BasePlayer {
    pub uuid: Uuid,
    pub username: String,
    pub rank: Rank,
}

#[derive(Serialize)]
pub struct Player {
    #[serde(flatten)]
    pub base: BasePlayer,
    pub skyblock: PlayerSkyBlock,
}

/// SkyBlock stuff that applies to all of the player's profiles.
#[derive(Serialize)]
pub struct PlayerSkyBlock {
    pub profiles: Vec<PlayerProfileInfo>,
    pub selected_profile: Option<Uuid>,
}

#[derive(Serialize)]
pub struct PlayerProfileInfo {
    pub uuid: Uuid,
    pub name: String,
    pub game_mode: GameMode,
}

#[derive(Serialize)]
pub struct Rank {
    /// The plain name like `MVP+`.
    pub name: String,
    /// Hex color code, prefixed with a #.
    pub color: String,
    pub plus_color: Option<String>,
    /// The name formatted with Minecraft color codes, like `§b[MVP§2+§b]`.
    pub formatted: String,
}
