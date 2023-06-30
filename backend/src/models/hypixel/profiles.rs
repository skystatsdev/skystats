use std::collections::HashMap;

use serde::Deserialize;
use uuid::Uuid;

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
}

#[derive(Deserialize, Default)]
pub struct SkyBlockLeveling {
    #[serde(default)]
    pub experience: u64,
}
