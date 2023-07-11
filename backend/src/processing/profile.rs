use tracing::warn;
use uuid::Uuid;

use crate::{
    hypixel,
    models::{
        self,
        inventory::{Inventories, Item, WardrobeSlot},
        profile::{GameMode, ProfileMember},
    },
    mojang, processing,
    routes::ApiError,
};

use super::{dungeons::process_dungeons, rank::rank, skills::process_skills, stats::process_stats};

pub async fn profile(player_uuid: Uuid, profile_uuid: Uuid) -> Result<ProfileMember, ApiError> {
    let player = processing::player::player(player_uuid).await?;
    let profiles = hypixel::profiles(player_uuid).await?;

    let profile = profiles
        .profiles
        .iter()
        .find(|profile| profile.profile_id == profile_uuid)
        .ok_or(ApiError::ProfileNotFound {
            username: player.base.username.clone(),
            profile: profile_uuid.to_string(),
        })?;

    let member = profile
        .members
        .get(&player_uuid)
        .ok_or(ApiError::ProfileNotFound {
            username: player.base.username.clone(),
            profile: profile_uuid.to_string(),
        })?;

    // get the usernames and ranks of all profile members
    let mut mojang_profiles_futures = Vec::new();
    let mut hypixel_player_futures = Vec::new();
    for &uuid in profile.members.keys() {
        mojang_profiles_futures.push(tokio::spawn(mojang::profile_from_uuid(uuid)));
        hypixel_player_futures.push(tokio::spawn(hypixel::player(uuid)));
    }
    let mut profile_members: Vec<models::player::BasePlayer> = Vec::new();
    for (mojang_future, hypixel_player_future) in mojang_profiles_futures
        .into_iter()
        .zip(hypixel_player_futures)
    {
        let mojang_profile = mojang_future.await.unwrap()?;
        let hypixel_player = hypixel_player_future.await.unwrap()?;
        profile_members.push(models::player::BasePlayer {
            uuid: mojang_profile.uuid,
            username: mojang_profile.username,
            rank: rank(&hypixel_player.player.rank),
        });
    }

    let inventories = Inventories {
        armor: process_optional_inventory(&member.inv_armor)?.map(|mut armor| {
            // reverse it so helmet is first
            armor.reverse();
            armor
        }),
        player: process_optional_inventory(&member.inv_contents)?,
        ender_chest: process_optional_inventory(&member.ender_chest_contents)?,
        accessory_bag: process_optional_inventory(&member.talisman_bag)?,
        potion_bag: process_optional_inventory(&member.potion_bag)?,
        fishing_bag: process_optional_inventory(&member.fishing_bag)?,
        quiver: process_optional_inventory(&member.quiver)?,
        trick_or_treat_bag: process_optional_inventory(&member.candy_inventory_contents)?,
        wardrobe: process_optional_inventory(&member.wardrobe_contents)?.map(process_wardrobe),
        personal_vault: process_optional_inventory(&member.personal_vault_contents)?,
    };

    Ok(ProfileMember {
        player,
        profile: models::profile::Profile {
            uuid: profile.profile_id,
            members: profile_members,
            game_mode: profile
                .game_mode
                .as_deref()
                .map(super::profile::game_mode_from_name)
                .unwrap_or_default(),
        },

        profile_name: profile.cute_name.clone(),

        skyblock_level: member.leveling.experience as f64 / 100.,
        fairy_souls: member.fairy_souls_collected,
        inventories,
        skills: process_skills(&member, &profile),
        stats: process_stats(&member.stats),
        dungeons: process_dungeons(&member),
    })
}

pub fn process_optional_inventory(
    inv: &Option<models::hypixel::inventory::Inventory>,
) -> Result<Option<Vec<Option<Item>>>, ApiError> {
    inv.as_ref()
        .map(processing::inventory::inventory)
        .transpose()
}

pub fn process_wardrobe(inv: Vec<Option<Item>>) -> Vec<WardrobeSlot> {
    if inv.len() % 4 != 0 {
        warn!("Wardrobe inventory length is not a multiple of 4");
    }

    let mut wardrobe = Vec::new();

    // first process it into pages of 9*4 and then the first 9 are helmet, second 9 are chestplate,
    // etc.

    for page in inv.chunks(9 * 4) {
        for i in 0..9 {
            let helmet = page.get(i).cloned().flatten();
            let chestplate = page.get(i + 9).cloned().flatten();
            let leggings = page.get(i + 9 * 2).cloned().flatten();
            let boots = page.get(i + 9 * 3).cloned().flatten();

            let slot = WardrobeSlot {
                helmet,
                chestplate,
                leggings,
                boots,
            };

            // ignore the slot if it's completely empty
            if slot.helmet.is_none()
                && slot.chestplate.is_none()
                && slot.leggings.is_none()
                && slot.boots.is_none()
            {
                continue;
            }

            wardrobe.push(slot);
        }
    }

    wardrobe
}

pub fn game_mode_from_name(name: &str) -> GameMode {
    match name {
        "bingo" => GameMode::Bingo,
        "island" => GameMode::Island,
        "ironman" => GameMode::Ironman,
        _ => {
            warn!("Unknown game mode: {name}");
            GameMode::Normal
        }
    }
}
