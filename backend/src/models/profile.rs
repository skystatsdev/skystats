use std::{collections::HashMap, time::Duration};

use serde::Serialize;
use serde_with::{serde_as, DurationMilliSeconds};
use uuid::Uuid;

use super::{
    inventory::Inventories,
    player::{BasePlayer, Player},
};

#[derive(Serialize)]
pub struct ProfileMember {
    pub player: Player,
    pub profile: Profile,

    /// Profile names can be different for each player, so they're here instead
    /// of in `profile`.
    pub profile_name: String,

    pub skyblock_level: f64,
    pub fairy_souls: u32,
    pub inventories: Inventories,
    pub skills: Skills,
    pub stats: Stats,
    pub dungeons: Dungeons,
}

#[derive(Serialize)]
pub struct Profile {
    pub uuid: Uuid,
    pub game_mode: GameMode,
    pub members: Vec<BasePlayer>,
}

#[derive(Serialize, Default)]
#[serde(rename_all = "snake_case")]
pub enum GameMode {
    #[default]
    Normal,
    Bingo,
    Island,
    Ironman,
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

#[serde_as]
#[derive(Serialize)]
pub struct Stats {
    pub deaths: MobStats,
    pub kills: MobStats,

    // serialize as milliseconds since otherwise it looks weird
    #[serde_as(as = "HashMap<_, DurationMilliSeconds>")]
    pub races: HashMap<String, Duration>,

    pub auctions: HashMap<String, u32>,
    pub dragon: HashMap<String, u32>,
    pub rift: HashMap<String, u32>,
    pub fishing: FishingStats,
    pub mythos: MythosStats,
    pub highest_damage: HighestDamageStats,
    pub winter_records: HashMap<String, u32>,

    pub misc: HashMap<String, f64>,
}

#[derive(Serialize, Default)]
pub struct MobStats {
    pub total: u32,
    pub by_mob: HashMap<String, u32>,
}

#[derive(Serialize, Default)]
pub struct FishingStats {
    pub total_items_fished: u32,
    pub items_fished: HashMap<String, u32>,
    pub sea_creature_kills: u32,
    pub shredder: HashMap<String, u32>,
}

#[derive(Serialize, Default)]
pub struct MythosStats {
    pub kills: u32,
    pub burrows: HashMap<String, u32>,
}

#[derive(Serialize, Default)]
pub struct HighestDamageStats {
    pub normal: f64,
    pub critical: f64,
}

#[derive(Serialize)]
pub struct Dungeons {
    pub dungeoneering: Skill,
    pub classes: Classes,
}

#[derive(Serialize)]
pub struct Classes {
    pub healer: Skill,
    pub mage: Skill,
    pub berserk: Skill,
    pub archer: Skill,
    pub tank: Skill,
}
