use serde::Serialize;
use uuid::Uuid;

use super::{inventory::Inventories, player::BasePlayer};

#[derive(Serialize)]
pub struct Profile {
    pub uuid: Uuid,
    pub members: Vec<BasePlayer>,
}

#[derive(Serialize)]
pub struct ProfileMember {
    pub player: BasePlayer,
    pub profile: Profile,

    /// Profile names can be different for each player, so they're here instead
    /// of in `profile`.
    pub profile_name: String,

    pub skyblock_level: f64,
    pub fairy_souls: u32,
    pub inventories: Inventories,
    pub skills: Skills,
}

#[derive(Serialize)]
pub struct Skill {
    pub xp: f64,
    pub level: u32,
    pub max_level: u32,
    pub xp_current: f64,
    pub xp_for_next: u32,
    pub progress: f64,
    pub level_cap: u32,
    pub uncapped_level: u32,
    pub level_with_progress: f64,
    pub uncapped_level_with_progress: f64,
}

#[derive(Serialize)]
pub struct Skills {
    pub farming: Skill,
    pub mining: Skill,
    pub combat: Skill,
    pub foraging: Skill,
    pub fishing: Skill,
    pub enchanting: Skill,
    pub alchemy: Skill,
    pub carpentry: Skill,
    pub runecrafting: Skill,
    pub social: Skill,
    pub taming: Skill,
}
