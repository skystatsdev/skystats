use crate::models::{
    hypixel::profiles::{DungeonClass, DungeonType, ListedProfileMember},
    profile::{Classes, Dungeons},
};

use super::skills::{get_level_by_xp, SkillKind};

fn get_class_experience(raw_stats: &ListedProfileMember, class: DungeonClass) -> f64 {
    raw_stats
        .dungeons
        .as_ref()
        .and_then(|dungeons| dungeons.player_classes.as_ref()?.get(&class))
        .map_or(0.0, |class_stats| class_stats.experience)
}

pub fn process_dungeons(raw_stats: &ListedProfileMember) -> Dungeons {
    let catacombs_experience = raw_stats
        .dungeons
        .as_ref()
        .map(|dungeons| {
            dungeons
                .dungeon_types
                .as_ref()
                .unwrap()
                .get(&DungeonType::Catacombs)
        })
        .flatten()
        .and_then(|dungeon_stats| dungeon_stats.experience)
        .unwrap_or(0.0);

    let classes = Classes {
        healer: get_level_by_xp(
            SkillKind::Dungeoneering,
            get_class_experience(&raw_stats, DungeonClass::Healer),
            None,
            true,
        ),
        mage: get_level_by_xp(
            SkillKind::Dungeoneering,
            get_class_experience(&raw_stats, DungeonClass::Mage),
            None,
            true,
        ),
        berserk: get_level_by_xp(
            SkillKind::Dungeoneering,
            get_class_experience(&raw_stats, DungeonClass::Berserk),
            None,
            true,
        ),
        archer: get_level_by_xp(
            SkillKind::Dungeoneering,
            get_class_experience(&raw_stats, DungeonClass::Archer),
            None,
            true,
        ),
        tank: get_level_by_xp(
            SkillKind::Dungeoneering,
            get_class_experience(&raw_stats, DungeonClass::Tank),
            None,
            true,
        ),
    };

    let dungeons = Dungeons {
        dungeoneering: get_level_by_xp(SkillKind::Dungeoneering, catacombs_experience, None, true),
        classes,
    };

    dungeons
}
