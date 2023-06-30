use serde::Serialize;
use uuid::Uuid;

use super::player::BasePlayer;

#[derive(Serialize)]
pub struct ProfileMember {
    pub player: BasePlayer,
    pub profile: Profile,

    /// Profile names can be different for each player, so they're here instead
    /// of in `profile`.
    pub profile_name: String,

    pub skyblock_level: f64,

    pub fairy_souls: u32,
}

#[derive(Serialize)]
pub struct Profile {
    pub uuid: Uuid,
    pub members: Vec<BasePlayer>,
}
