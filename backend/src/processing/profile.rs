use tracing::warn;
use uuid::Uuid;

use crate::{
    hypixel,
    models::{
        self,
        inventory::{Inventories, Item, WardrobeSlot},
        profile::{ProfileMember, Skills},
    },
    mojang, processing,
    routes::ApiError,
};

use super::skills::{get_level_by_xp, SkillKind};

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

    // get the usernames of all profile members
    let mut mojang_profiles_futures = Vec::new();
    for &uuid in profile.members.keys() {
        mojang_profiles_futures.push(tokio::spawn(mojang::profile_from_uuid(uuid)));
    }
    let mut profile_members: Vec<models::player::BasePlayer> = Vec::new();
    for future in mojang_profiles_futures {
        let mojang_profile = future.await.unwrap()?;
        profile_members.push(models::player::BasePlayer {
            uuid: mojang_profile.uuid,
            username: mojang_profile.username,
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

    let farming_level_cap = member
        .jacob2
        .as_ref()
        .and_then(|j| j.perks.as_ref())
        .map_or(0, |p| p.farming_level_cap);

    let skills = Skills {
        farming: get_level_by_xp(
            SkillKind::Farming,
            member.experience_skill_farming.unwrap_or(0.0),
            Some(farming_level_cap as u32),
        ),
        mining: get_level_by_xp(
            SkillKind::Mining,
            member.experience_skill_mining.unwrap_or(0.0),
            None,
        ),
        combat: get_level_by_xp(
            SkillKind::Combat,
            member.experience_skill_combat.unwrap_or(0.0),
            None,
        ),
        foraging: get_level_by_xp(
            SkillKind::Foraging,
            member.experience_skill_foraging.unwrap_or(0.0),
            None,
        ),
        fishing: get_level_by_xp(
            SkillKind::Fishing,
            member.experience_skill_fishing.unwrap_or(0.0),
            None,
        ),
        enchanting: get_level_by_xp(
            SkillKind::Enchanting,
            member.experience_skill_enchanting.unwrap_or(0.0),
            None,
        ),
        alchemy: get_level_by_xp(
            SkillKind::Alchemy,
            member.experience_skill_alchemy.unwrap_or(0.0),
            None,
        ),
        carpentry: get_level_by_xp(
            SkillKind::Carpentry,
            member.experience_skill_carpentry.unwrap_or(0.0),
            None,
        ),
        runecrafting: get_level_by_xp(
            SkillKind::Runecrafting,
            member.experience_skill_runecrafting.unwrap_or(0.0),
            None,
        ),
        social: get_level_by_xp(
            SkillKind::Social,
            member.experience_skill_social2.unwrap_or(0.0),
            None,
        ),
        taming: get_level_by_xp(
            SkillKind::Taming,
            member.experience_skill_taming.unwrap_or(0.0),
            None,
        ),
    };

    Ok(ProfileMember {
        player: player.base,
        profile: models::profile::Profile {
            uuid: profile.profile_id,
            members: profile_members,
        },

        profile_name: profile.cute_name.clone(),

        skyblock_level: member.leveling.experience as f64 / 100.,
        fairy_souls: member.fairy_souls_collected,
        inventories,
        skills,
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
