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
