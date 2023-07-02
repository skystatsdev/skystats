use crate::models::profile::Skill;

const LEVELING_XP: [(u32, u32); 60] = [
    (1, 50),
    (2, 125),
    (3, 200),
    (4, 300),
    (5, 500),
    (6, 750),
    (7, 1000),
    (8, 1500),
    (9, 2000),
    (10, 3500),
    (11, 5000),
    (12, 7500),
    (13, 10000),
    (14, 15000),
    (15, 20000),
    (16, 30000),
    (17, 50000),
    (18, 75000),
    (19, 100000),
    (20, 200000),
    (21, 300000),
    (22, 400000),
    (23, 500000),
    (24, 600000),
    (25, 700000),
    (26, 800000),
    (27, 900000),
    (28, 1000000),
    (29, 1100000),
    (30, 1200000),
    (31, 1300000),
    (32, 1400000),
    (33, 1500000),
    (34, 1600000),
    (35, 1700000),
    (36, 1800000),
    (37, 1900000),
    (38, 2000000),
    (39, 2100000),
    (40, 2200000),
    (41, 2300000),
    (42, 2400000),
    (43, 2500000),
    (44, 2600000),
    (45, 2750000),
    (46, 2900000),
    (47, 3100000),
    (48, 3400000),
    (49, 3700000),
    (50, 4000000),
    (51, 4300000),
    (52, 4600000),
    (53, 4900000),
    (54, 5200000),
    (55, 5500000),
    (56, 5800000),
    (57, 6100000),
    (58, 6400000),
    (59, 6700000),
    (60, 7000000),
];

const LEVELING_XP_RUNECRAFTING: [(u32, u32); 25] = [
    (1, 50),
    (2, 100),
    (3, 125),
    (4, 160),
    (5, 200),
    (6, 250),
    (7, 315),
    (8, 400),
    (9, 500),
    (10, 625),
    (11, 785),
    (12, 1000),
    (13, 1250),
    (14, 1600),
    (15, 2000),
    (16, 2465),
    (17, 3125),
    (18, 4000),
    (19, 5000),
    (20, 6200),
    (21, 7800),
    (22, 9800),
    (23, 12200),
    (24, 15300),
    (25, 19050),
];

const LEVELING_XP_SOCIAL: [(u32, u32); 25] = [
    (1, 50),
    (2, 100),
    (3, 150),
    (4, 250),
    (5, 500),
    (6, 750),
    (7, 1000),
    (8, 1250),
    (9, 1500),
    (10, 2000),
    (11, 2500),
    (12, 3000),
    (13, 3750),
    (14, 4500),
    (15, 6000),
    (16, 8000),
    (17, 10000),
    (18, 12500),
    (19, 15000),
    (20, 20000),
    (21, 25000),
    (22, 30000),
    (23, 35000),
    (24, 40000),
    (25, 50000),
];

const DUNGEONEERING_XP: [(u32, u32); 50] = [
    (1, 50),
    (2, 75),
    (3, 110),
    (4, 160),
    (5, 230),
    (6, 330),
    (7, 470),
    (8, 670),
    (9, 950),
    (10, 1340),
    (11, 1890),
    (12, 2665),
    (13, 3760),
    (14, 5260),
    (15, 7380),
    (16, 10300),
    (17, 14400),
    (18, 20000),
    (19, 27600),
    (20, 38000),
    (21, 52500),
    (22, 71500),
    (23, 97000),
    (24, 132000),
    (25, 180000),
    (26, 243000),
    (27, 328000),
    (28, 445000),
    (29, 600000),
    (30, 800000),
    (31, 1065000),
    (32, 1410000),
    (33, 1900000),
    (34, 2500000),
    (35, 3300000),
    (36, 4300000),
    (37, 5600000),
    (38, 7200000),
    (39, 9200000),
    (40, 12000000),
    (41, 15000000),
    (42, 19000000),
    (43, 24000000),
    (44, 30000000),
    (45, 38000000),
    (46, 48000000),
    (47, 60000000),
    (48, 75000000),
    (49, 93000000),
    (50, 116250000),
];

const DEFAULT_SKILL_CAPS: [(&str, u32); 11] = [
    ("farming", 50),
    ("mining", 60),
    ("combat", 60),
    ("foraging", 50),
    ("fishing", 50),
    ("enchanting", 60),
    ("alchemy", 50),
    ("taming", 50),
    ("carpentry", 50),
    ("runecrafting", 25),
    ("social2", 25),
];

const MAXED_SKILL_CAPS: [(&str, u32); 1] = [("farming", 60)];

fn get_leveling_table(r#type: &str, skill_name: &str) -> &'static [(u32, u32)] {
    match r#type {
        "skills" => match skill_name {
            "runecrafting" => &LEVELING_XP_RUNECRAFTING,
            "social2" => &LEVELING_XP_SOCIAL,
            _ => &LEVELING_XP,
        },
        "dungeons" => &DUNGEONEERING_XP,
        _ => panic!("Invalid type"),
    }
}

pub fn get_level_by_xp(r#type: &str, skill_name: &str, xp: f64, cap: Option<u32>) -> Skill {
    // the name of the skill in lowercase
    let skill: String = skill_name.to_lowercase();

    // the table of xp required for each level
    let xp_table = get_leveling_table(r#type, skill.as_str());

    // the level that this player is caped at
    // ? let levelCap = (DEFAULT_SKILL_CAPS[skill] ?? xp_table.length) + (cap ?? 0)
    let level_cap = DEFAULT_SKILL_CAPS
        .iter()
        .find(|(name, _)| name == &skill)
        .map(|(_, level)| *level)
        .unwrap_or(xp_table.len() as u32)
        + cap.unwrap_or(0);

    // the level ignoring the cap and using only the table
    let mut uncapped_level = 0;

    // the amount of xp over the amount required for the level (used for calculation progress to next level)
    let mut xp_current = xp;

    // like xpCurrent but ignores cap
    let mut xp_remaining = xp;

    while uncapped_level < xp_table.len() && xp_table[uncapped_level].1 <= xp_remaining as u32 {
        xp_remaining -= xp_table[uncapped_level].1 as f64;
        if uncapped_level <= level_cap as usize {
            xp_current = xp_remaining;
        }

        uncapped_level += 1;
    }

    // adds support for catacombs level above 50
    if r#type == "dungeoneering" {
        uncapped_level += (xp_current / 200_000_000.0) as usize;
        xp_current %= 200_000_000.0;
    }

    // the maximum level that any player can achieve (used for gold progress bars)
    // TODO: add ignoreCap argument (used for catacombs level above 50)
    let max_level = MAXED_SKILL_CAPS
        .iter()
        .find(|(name, _)| name == &skill)
        .map(|(_, level)| *level)
        .unwrap_or(level_cap);

    // the level as displayed by in game UI
    let level = if uncapped_level > level_cap as usize {
        level_cap
    } else {
        uncapped_level as u32
    };

    // the amount amount of xp needed to reach the next level (used for calculation progress to next level)
    let xp_for_next = if level < max_level {
        xp_table[level as usize].1
    } else {
        0
    };

    // the fraction of the way toward the next level
    let progress = if level == max_level {
        1.0
    } else {
        xp_current as f64 / xp_for_next as f64
    };

    // a floating point value representing the current level for example if you are half way to level 5 it would be 4.5
    let level_with_progress = if level == level_cap {
        level as f64
    } else {
        level as f64 + progress
    };

    // a floating point value representing the current level ignoring the in-game unlockable caps for example if you are half way to level 5 it would be 4.5
    let uncapped_level_with_progress = if level == max_level {
        uncapped_level as f64
    } else {
        uncapped_level as f64 + progress
    };

    Skill {
        xp,
        level,
        max_level,
        xp_current,
        xp_for_next,
        progress,
        level_cap,
        uncapped_level,
        level_with_progress,
        uncapped_level_with_progress,
    }
}
