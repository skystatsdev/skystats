use std::io::{Cursor, Read};

use base64::Engine;
use flate2::read::GzDecoder;
use tracing::warn;

use crate::{
    models::{
        self,
        hypixel::inventory::InventoryNbt,
        profile::{Item, ItemDisplay},
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
    let nbt = fastnbt::from_bytes::<InventoryNbt>(&data_bytes)?;

    let mut items = Vec::new();
    for item_nbt in nbt.i {
        // make it a compound and check if "id" is present, if not, skip
        let fastnbt::Value::Compound(ref item_nbt_compound) = item_nbt else {
            warn!("ItemNbt is not a compound");
            items.push(None);
            continue;
        };
        if !item_nbt_compound.contains_key("id") {
            // this just means the item isn't present
            items.push(None);
            continue;
        }

        // try to parse as ItemNbt
        let item_nbt: models::hypixel::inventory::ItemNbt = fastnbt::from_value(&item_nbt)?;

        items.push(Some(Item {
            id: item_nbt.id,
            damage: item_nbt.damage,
            count: item_nbt.count,
            skyblock_id: item_nbt.tag.extra_attributes.id,
            display: ItemDisplay {
                name: item_nbt.tag.display.name,
                lore: item_nbt.tag.display.lore,
                color: item_nbt.tag.display.color,
                has_glint: item_nbt.tag.ench.is_some(),
            },
            enchantments: item_nbt.tag.extra_attributes.enchantments,
            timestamp: item_nbt.tag.extra_attributes.timestamp,
        }))
    }

    Ok(items)
}
