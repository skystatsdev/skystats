use uuid::Uuid;

use crate::{
    hypixel,
    models::{
        self,
        profile::{Inventories, ProfileMember},
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

    fn process_optional_inventory(
        inv: &Option<models::hypixel::inventory::Inventory>,
    ) -> Result<Option<Vec<Option<models::profile::Item>>>, ApiError> {
        inv.as_ref()
            .map(processing::inventory::inventory)
            .transpose()
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
    })
}
