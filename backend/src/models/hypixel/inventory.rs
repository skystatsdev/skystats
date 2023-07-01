use std::collections::HashMap;

use serde::Deserialize;

use crate::{
    models::{self},
    processing,
    routes::ApiError,
};

#[derive(Deserialize)]
pub struct Inventory {
    #[serde(rename = "type")]
    pub kind: i32,
    pub data: String,
}

#[derive(Deserialize)]
pub struct InventoryNbt {
    pub i: Vec<fastnbt::Value>,
}

#[derive(Deserialize)]
pub struct ItemNbt {
    #[serde(rename = "Count")]
    pub count: i8,
    #[serde(rename = "Damage")]
    #[serde(default)]
    pub damage: i16,
    pub id: i16,
    pub tag: ItemTag,
}

#[derive(Deserialize)]
pub struct ItemTag {
    #[serde(rename = "HideFlags")]
    #[serde(default)]
    pub hide_flags: i32,
    #[serde(rename = "Unbreakable")]
    #[serde(default)]
    pub unbreakable: bool,
    #[serde(default)]
    pub ench: Option<Vec<ItemVanillaEnchantment>>,
    #[serde(rename = "ExtraAttributes")]
    pub extra_attributes: ItemExtraAttributes,
    pub display: ItemDisplay,
    #[serde(rename = "SkullOwner")]
    #[serde(default)]
    pub skull_owner: Option<ItemSkullOwner>,
}

#[derive(Deserialize)]
pub struct ItemVanillaEnchantment {
    pub id: i16,
    pub lvl: i16,
}

#[derive(Deserialize)]
pub struct ItemExtraAttributes {
    #[serde(default)]
    pub anvil_uses: Option<i32>,
    #[serde(default)]
    pub enchantments: HashMap<String, i32>,
    #[serde(default)]
    pub id: Option<String>,
    #[serde(default)]
    pub modifier: Option<String>,
    #[serde(rename = "originTag")]
    #[serde(default)]
    pub origin_tag: Option<String>,
    #[serde(default)]
    pub timestamp: Option<String>,
    #[serde(default)]
    pub uuid: Option<String>,
}

#[derive(Deserialize)]
pub struct ItemDisplay {
    #[serde(rename = "Lore")]
    #[serde(default)]
    pub lore: Vec<String>,
    #[serde(rename = "Name")]
    pub name: String,
    #[serde(default)]
    pub color: Option<i32>,
}

#[derive(Deserialize)]
pub struct ItemSkullOwner {
    #[serde(rename = "Properties")]
    pub properties: ItemSkullOwnerProperty,
}
#[derive(Deserialize)]
pub struct ItemSkullOwnerProperty {
    pub textures: Vec<ItemSkullOwnerTexture>,
}
#[derive(Deserialize)]
pub struct ItemSkullOwnerTexture {
    #[serde(rename = "Value")]
    pub value: String,
}

pub fn process_optional_inventory(
    inv: &Option<models::hypixel::inventory::Inventory>,
) -> Result<Option<Vec<Option<models::profile::Item>>>, ApiError> {
    inv.as_ref()
        .map(processing::inventory::inventory)
        .transpose()
}
