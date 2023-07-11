use std::collections::HashMap;

use serde::Deserialize;
use uuid::Uuid;

use super::inventory::Inventory;

#[derive(Deserialize)]
pub struct Profiles {
    pub success: bool,
    pub profiles: Vec<ListedProfile>,
}

#[derive(Deserialize)]
pub struct ListedProfile {
    pub profile_id: Uuid,
    pub cute_name: String,
    pub selected: bool,
    #[serde(default)]
    pub game_mode: Option<String>,

    pub members: HashMap<Uuid, ListedProfileMember>,

    #[serde(flatten)]
    pub other: HashMap<String, serde_json::Value>,
}

#[derive(Deserialize)]
pub struct ListedProfileMember {
    #[serde(default)]
    pub fairy_souls_collected: u32,
    #[serde(default)]
    pub coin_purse: f64,
    #[serde(default)]
    pub leveling: SkyBlockLeveling,

    #[serde(default)]
    pub inv_armor: Option<Inventory>,
    #[serde(default)]
    pub inv_contents: Option<Inventory>,
    #[serde(default)]
    pub ender_chest_contents: Option<Inventory>,
    #[serde(default)]
    pub talisman_bag: Option<Inventory>,
    #[serde(default)]
    pub potion_bag: Option<Inventory>,
    #[serde(default)]
    pub fishing_bag: Option<Inventory>,
    #[serde(default)]
    pub quiver: Option<Inventory>,
    #[serde(default)]
    pub candy_inventory_contents: Option<Inventory>,
    #[serde(default)]
    pub wardrobe_contents: Option<Inventory>,
    #[serde(default)]
    pub personal_vault_contents: Option<Inventory>,

    #[serde(default)]
    pub experience_skill_runecrafting: Option<f64>,
    #[serde(default)]
    pub experience_skill_alchemy: Option<f64>,
    #[serde(default)]
    pub experience_skill_taming: Option<f64>,
    #[serde(default)]
    pub experience_skill_combat: Option<f64>,
    #[serde(default)]
    pub experience_skill_farming: Option<f64>,
    #[serde(default)]
    pub experience_skill_social2: Option<f64>,
    #[serde(default)]
    pub experience_skill_enchanting: Option<f64>,
    #[serde(default)]
    pub experience_skill_fishing: Option<f64>,
    #[serde(default)]
    pub experience_skill_foraging: Option<f64>,
    #[serde(default)]
    pub experience_skill_carpentry: Option<f64>,
    #[serde(default)]
    pub experience_skill_mining: Option<f64>,

    #[serde(default)]
    pub jacob2: Option<Jacob2>,

    #[serde(default)]
    pub stats: HashMap<String, f64>,

    #[serde(default)]
    pub dungeons: Option<Dungeons>,
}

#[derive(Deserialize, Default)]
pub struct SkyBlockLeveling {
    #[serde(default)]
    pub experience: u64,
}

#[derive(Deserialize, Default)]
pub struct Jacob2 {
    #[serde(default)]
    pub perks: Option<JacobPerks>,
}

#[derive(Deserialize, Default)]
pub struct JacobPerks {
    #[serde(default)]
    pub farming_level_cap: usize,
}

#[derive(Deserialize, Eq, Hash, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum DungeonType {
    Catacombs,
    MasterCatacombs,
}

#[derive(Deserialize, Eq, Hash, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum DungeonClass {
    Healer,
    Mage,
    Archer,
    Berserk,
    Tank,
}

#[derive(Deserialize, Default)]
pub struct Dungeons {
    #[serde(default)]
    pub dungeon_types: Option<HashMap<DungeonType, DungeonStats>>,
    pub player_classes: Option<HashMap<DungeonClass, Class>>,
}

#[derive(Deserialize, Default)]
pub struct Class {
    #[serde(default)]
    pub experience: f64,
}

#[derive(Deserialize, Default)]
pub struct DungeonStats {
    #[serde(default)]
    pub experience: Option<f64>,
    /*#[serde(default)]
    pub times_played: Option<HashMap<u32, u32>>,
    #[serde(default)]
    pub tier_completions: Option<HashMap<u32, u32>>,
    #[serde(default)]
    pub fastest_time: Option<HashMap<u32, u32>>,
    #[serde(default)]
    pub best_runs: Option<HashMap<u32, Vec<BestRun>>>,
    #[serde(default)]
    pub best_score: Option<HashMap<u32, u32>>,
    #[serde(default)]
    pub mobs_killed: Option<HashMap<u32, u32>>,
    #[serde(default)]
    pub most_mobs_killed: Option<HashMap<u32, u32>>,
    #[serde(default)]
    pub most_damage_archer: Option<HashMap<u32, u32>>,
    #[serde(default)]
    pub most_healing: Option<HashMap<u32, u32>>,
    #[serde(default)]
    pub watcher_kills: Option<HashMap<u32, u32>>,
    #[serde(default)]
    pub highest_tier_completed: Option<u32>,
    #[serde(default)]
    pub most_damage_tank: Option<HashMap<u32, u32>>,
    #[serde(default)]
    pub fastest_time_s_plus: Option<HashMap<u32, u32>>,
    #[serde(default)]
    pub most_damage_mage: Option<HashMap<u32, u32>>,
    #[serde(default)]
    pub most_damage_healer: Option<HashMap<u32, u32>>,
    #[serde(default)]
    pub fastest_time_s: Option<HashMap<u32, u32>>,
    #[serde(default)]
    pub most_damage_berserk: Option<HashMap<u32, u32>>,
    #[serde(default)]
    pub milestone_completions: Option<HashMap<u32, u32>>,*/
}

/*
#[derive(Deserialize, Default)]
pub struct BestRun {
    #[serde(default)]
    timestamp: u64,
    #[serde(default)]
    score_exploration: u32,
    #[serde(default)]
    score_speed: u32,
    #[serde(default)]
    score_skill: u32,
    #[serde(default)]
    score_bonus: u32,
    #[serde(default)]
    dungeon_class: String,
    #[serde(default)]
    teammates: Vec<String>,
    #[serde(default)]
    elapsed_time: u32,
    #[serde(default)]
    damage_dealt: u32,
    #[serde(default)]
    deaths: u32,
    #[serde(default)]
    mobs_killed: u32,
    #[serde(default)]
    secrets_found: u32,
    #[serde(default)]
    damage_mitigated: Option<u32>,
    #[serde(default)]
    ally_healing: Option<u32>,
}*/
