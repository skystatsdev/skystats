use std::collections::HashMap;

use serde::Serialize;

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
    pub wardrobe: Option<Vec<WardrobeSlot>>,
    pub personal_vault: Option<Vec<Option<Item>>>,
}

#[derive(Serialize, Clone)]
pub struct Item {
    pub id: i16,
    pub damage: i16,
    pub count: i8,

    pub head_texture_id: Option<String>,

    pub skyblock_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub reforge: Option<String>,

    pub display: ItemDisplay,

    #[serde(skip_serializing_if = "HashMap::is_empty")]
    pub enchantments: HashMap<String, i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub timestamp: Option<String>,
}

#[derive(Serialize, Clone)]
pub struct ItemDisplay {
    pub name: String,
    pub lore: Vec<String>,

    pub has_glint: bool,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub color: Option<i32>,
}

#[derive(Serialize)]
pub struct WardrobeSlot {
    pub helmet: Option<Item>,
    pub chestplate: Option<Item>,
    pub leggings: Option<Item>,
    pub boots: Option<Item>,
}
