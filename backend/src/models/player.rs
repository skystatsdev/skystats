use std::collections::HashMap;

use serde::Serialize;
use uuid::Uuid;

#[derive(Debug, Serialize)]
pub struct Player {
    pub uuid: Uuid,
    pub username: String,
    pub skyblock: PlayerSkyBlock,
}

/// SkyBlock stuff that applies to all of the player's profiles.
#[derive(Debug, Serialize)]
pub struct PlayerSkyBlock {
    pub profile_names: HashMap<Uuid, String>,
}
