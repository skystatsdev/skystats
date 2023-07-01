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
    pub player: Option<Vec<Option<Item>>>,
    pub ender_chest: Option<Vec<Option<Item>>>,
    pub accessory_bag: Option<Vec<Option<Item>>>,
    pub potion_bag: Option<Vec<Option<Item>>>,
    pub fishing_bag: Option<Vec<Option<Item>>>,
    pub quiver: Option<Vec<Option<Item>>>,
    pub trick_or_treat_bag: Option<Vec<Option<Item>>>,
    pub wardrobe: Option<Vec<Option<Item>>>,
    pub personal_vault: Option<Vec<Option<Item>>>,
}

#[derive(Serialize)]
pub struct Item {
    pub id: i16,
    pub damage: i16,
    pub count: i8,
    pub skyblock_id: Option<String>,

    pub display: ItemDisplay,

    #[serde(skip_serializing_if = "HashMap::is_empty")]
    pub enchantments: HashMap<String, i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub timestamp: Option<String>,
}

#[derive(Serialize)]
pub struct ItemDisplay {
    pub name: String,
    pub lore: Vec<String>,

    pub has_glint: bool,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub color: Option<i32>,
}
