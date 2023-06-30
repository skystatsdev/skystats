use serde::Serialize;

use super::player::BasePlayer;

#[derive(Debug, Serialize)]
pub struct ProfileMember {
    pub player: BasePlayer,
    pub fairy_souls: u32,
}
