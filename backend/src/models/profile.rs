use std::collections::HashMap;

use serde::Serialize;
use uuid::Uuid;

use super::player::BasePlayer;

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
}

#[derive(Serialize)]
pub struct Inventories {
    pub armor: Option<Vec<Option<Item>>>,
}

#[derive(Serialize)]
pub struct Item {
    pub id: i16,
    pub damage: i16,
    pub count: i8,
    pub skyblock_id: Option<String>,

    pub display: ItemDisplay,
    pub enchantments: HashMap<String, i32>,

    pub timestamp: Option<String>,
}

#[derive(Serialize)]
pub struct ItemDisplay {
    pub name: String,
    pub lore: Vec<String>,
    pub color: Option<i32>,

    pub has_glint: bool,
}
