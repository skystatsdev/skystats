use serde::Serialize;

use super::player::BasePlayer;

#[derive(Debug, Serialize)]
pub struct ProfileMember {
    pub player: BasePlayer,
    pub profile_name: String,
    pub fairy_souls: u32,
}
