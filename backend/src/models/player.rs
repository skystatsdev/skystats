use std::collections::HashMap;

use serde::Serialize;
use uuid::Uuid;

#[derive(Debug, Serialize)]
pub struct BasePlayer {
    pub uuid: Uuid,
    pub username: String,
    // also include rank and stuff
}

#[derive(Debug, Serialize)]
pub struct Player {
    #[serde(flatten)]
    pub base: BasePlayer,
    pub skyblock: PlayerSkyBlock,
}

/// SkyBlock stuff that applies to all of the player's profiles.
#[derive(Debug, Serialize)]
pub struct PlayerSkyBlock {
    pub profile_names: HashMap<Uuid, String>,
}
