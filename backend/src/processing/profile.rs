use uuid::Uuid;

use crate::{
    hypixel,
    models::{
        self,
        hypixel::inventory::process_optional_inventory,
        hypixel::skills::get_level_by_xp,
        profile::{Inventories, ProfileMember, Skills},
    },
    mojang, processing,
    routes::ApiError,
};

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
        wardrobe: process_optional_inventory(&member.wardrobe_contents)?,
        personal_vault: process_optional_inventory(&member.personal_vault_contents)?,
    };

    let farming_level_cap = member
        .jacob2
        .as_ref()
        .and_then(|j| j.perks.as_ref())
        .map_or(0, |p| p.farming_level_cap);

    let skills = Skills {
        farming: get_level_by_xp(
            "skills",
            "farming",
            member.experience_skill_farming.unwrap_or(0.0),
            Some(farming_level_cap as u32),
        ),
        mining: get_level_by_xp(
            "skills",
            "mining",
            member.experience_skill_mining.unwrap_or(0.0),
            None,
        ),
        combat: get_level_by_xp(
            "skills",
            "combat",
            member.experience_skill_combat.unwrap_or(0.0),
            None,
        ),
        foraging: get_level_by_xp(
            "skills",
            "foraging",
            member.experience_skill_foraging.unwrap_or(0.0),
            None,
        ),
        fishing: get_level_by_xp(
            "skills",
            "fishing",
            member.experience_skill_fishing.unwrap_or(0.0),
            None,
        ),
        enchanting: get_level_by_xp(
            "skills",
            "enchanting",
            member.experience_skill_enchanting.unwrap_or(0.0),
            None,
        ),
        alchemy: get_level_by_xp(
            "skills",
            "alchemy",
            member.experience_skill_alchemy.unwrap_or(0.0),
            None,
        ),
        carpentry: get_level_by_xp(
            "skills",
            "carpentry",
            member.experience_skill_carpentry.unwrap_or(0.0),
            None,
        ),
        runecrafting: get_level_by_xp(
            "skills",
            "runecrafting",
            member.experience_skill_runecrafting.unwrap_or(0.0),
            None,
        ),
        social2: get_level_by_xp(
            "skills",
            "social",
            member.experience_skill_social2.unwrap_or(0.0),
            None,
        ),
        taming: get_level_by_xp(
            "skills",
            "taming",
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
