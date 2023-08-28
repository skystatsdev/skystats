use std::io::{Cursor, Read};

use base64::Engine;
use flate2::read::GzDecoder;
use simdnbt::Nbt;
use tracing::{debug, warn};

use crate::{
    models::{
        self,
        inventory::{Item, ItemDisplay},
    },
    routes::ApiError,
};

pub fn inventory(
    hypixel_data: &models::hypixel::inventory::Inventory,
) -> Result<Vec<Option<Item>>, ApiError> {
    // decode base64
    let data_bytes_gzipped =
        base64::engine::general_purpose::STANDARD.decode(hypixel_data.data.as_bytes())?;

    // decode gzip
    let mut decoder = GzDecoder::new(Cursor::new(data_bytes_gzipped));
    let mut data_bytes = vec![];
    decoder.read_to_end(&mut data_bytes).unwrap();

    // decode nbt
    let Some(nbt) = simdnbt::Nbt::new(&mut Cursor::new(&data_bytes))? else {
        warn!("NBT is empty");
        return Ok(Vec::new());
    };

    let items = items_from_nbt(nbt).ok_or_else(|| ApiError::NbtMissingFields)?;

    Ok(items)
}

fn items_from_nbt(nbt: Nbt) -> Option<Vec<Option<Item>>> {
    let mut items = Vec::new();
    for item_nbt in nbt
        .list("i")
        .and_then(|list| list.compounds())
        .unwrap_or_default()
    {
        // check if "id" is present, if not, skip
        if !item_nbt.contains("id") {
            // this just means the item isn't present
            items.push(None);
            continue;
        }

        // try to parse as ItemNbt
        // let item_nbt: models::hypixel::inventory::ItemNbt = fastnbt::from_value(&item_nbt)?;

        let item_tag = item_nbt.compound("tag")?;
        let item_extra_attributes = item_tag.compound("ExtraAttributes");
        let item_display = item_tag.compound("display");

        items.push(Some(Item {
            id: item_nbt.short("id")?,
            damage: item_nbt.short("Damage")?,
            count: item_nbt.byte("Count")?,

            head_texture_id: item_tag
                .compound("SkullOwner")
                .and_then(|skull_owner| skull_owner.compound("Properties"))
                .and_then(|properties| properties.list("textures"))
                .and_then(|textures| textures.compounds())
                .and_then(|textures| textures.get(0))
                .and_then(|texture| texture.string("Value"))
                .and_then(|value| texture_id_from_base64(&value.to_str())),
            skyblock_id: item_extra_attributes
                .and_then(|e| e.string("id"))
                .map(|id| id.to_string()),
            reforge: item_extra_attributes
                .and_then(|e| e.string("modifier"))
                .map(|id| id.to_string()),

            display: ItemDisplay {
                name: item_display
                    .and_then(|d| d.string("Name"))
                    .map(|n| n.to_string())
                    .unwrap_or_default(),
                lore: item_display
                    .and_then(|d| d.list("Lore"))
                    .and_then(|l| l.strings())
                    .map(|l| l.iter().map(|s| s.to_string()).collect())
                    .unwrap_or_default(),
                color: item_display.and_then(|d| d.int("color")),
                has_glint: item_extra_attributes
                    .map(|e| e.contains("ench"))
                    .unwrap_or_default(),
            },
            enchantments: item_extra_attributes
                .and_then(|e| e.compound("enchantments"))
                .map(|e| {
                    e.iter()
                        .map(|(k, v)| (k.to_string(), v.int().unwrap_or_default()))
                        .collect()
                })
                .unwrap_or_default(),
            timestamp: item_extra_attributes
                .and_then(|e| e.string("timestamp"))
                .map(|t| t.to_string()),
        }))
    }
    Some(items)
}

fn texture_id_from_base64(base64: &str) -> Option<String> {
    let data_bytes = base64::engine::general_purpose::STANDARD
        .decode(base64.as_bytes())
        .ok()?;

    // convert to json, then textures.SKIN.url and get the last part of the url
    let json: serde_json::Value = serde_json::from_slice(&data_bytes).ok()?;
    let texture_url = json["textures"]["SKIN"]["url"].as_str()?;
    let texture_id = texture_url.split('/').last()?.to_owned();

    Some(texture_id)
}
