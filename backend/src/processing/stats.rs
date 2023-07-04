use std::{collections::HashMap, time::Duration};

use crate::models::profile::{FishingStats, HighestDamageStats, MythosStats, Stats};

pub fn process_stats(raw_stats: &HashMap<String, f64>) -> Stats {
    // not Stats::default() specifically so it fails to compile when a new field is added
    let mut stats = Stats {
        deaths: Default::default(),
        kills: Default::default(),
        races: Default::default(),
        auctions: Default::default(),
        dragon: Default::default(),
        rift: Default::default(),
        fishing: FishingStats {
            total_items_fished: 0,
            sea_creature_kills: 0,
            items_fished: Default::default(),
            shredder: Default::default(),
        },
        mythos: MythosStats {
            kills: 0,
            burrows: Default::default(),
        },
        highest_damage: HighestDamageStats {
            normal: 0.,
            critical: 0.,
        },
        winter_records: Default::default(),

        misc: Default::default(),
    };

    for (key, &value) in raw_stats {
        if matches!(key.as_str(), "deaths" | "kills") {
            // these are the totals but we already count them ourselves
            continue;
        }

        if let Some(mob_id) = key.strip_prefix("kills_") {
            stats.kills.total += value as u32;
            stats.kills.by_mob.insert(mob_id.to_owned(), value as u32);
        } else if let Some(mob_id) = key.strip_prefix("deaths_") {
            stats.deaths.total += value as u32;
            stats.deaths.by_mob.insert(mob_id.to_owned(), value as u32);
        } else if let Some(race_id) = key
            .strip_suffix("_best_time")
            .or_else(|| key.strip_suffix("_best_time_2"))
        {
            let duration = Duration::from_millis(value as u64);
            stats.races.insert(race_id.to_owned(), duration);
        } else if let Some(stat) = key.strip_prefix("auctions_") {
            stats.auctions.insert(stat.to_owned(), value as u32);
        } else if let Some(stat) = key.strip_prefix("dragon_") {
            stats.dragon.insert(stat.to_owned(), value as u32);
        } else if let Some(stat) = key
            .strip_prefix("rift_")
            // there's a stat called "rifT_living_metal_spawnegg_used"
            .or_else(|| key.strip_prefix("rifT_"))
        {
            stats.rift.insert(stat.to_owned(), value as u32);
        } else if let Some(item_fished) = key.strip_prefix("items_fished_") {
            stats
                .fishing
                .items_fished
                .insert(item_fished.to_owned(), value as u32);
        } else if let Some(shredder_stat) = key.strip_prefix("shredder_") {
            stats
                .fishing
                .shredder
                .insert(shredder_stat.to_owned(), value as u32);
        } else if key == "items_fished" {
            stats.fishing.total_items_fished = value as u32;
        } else if key == "sea_creature_kills" {
            stats.fishing.sea_creature_kills = value as u32;
        } else if let Some(mythos_burrows_stat) = key.strip_prefix("mythos_burrows_") {
            stats
                .mythos
                .burrows
                .insert(mythos_burrows_stat.to_owned(), value as u32);
        } else if key == "mythos_kills" {
            stats.mythos.kills = value as u32;
        } else if key == "highest_critical_damage" {
            stats.highest_damage.critical = value;
        } else if key == "highest_damage" {
            stats.highest_damage.normal = value;
        } else if key == "highest_crit_damage" {
            // this stat is capped at integer limit and was replaced by
            // highest_critical_damage
            continue;
        } else if let Some(stat) = key.strip_prefix("most_winter_") {
            stats.winter_records.insert(stat.to_owned(), value as u32);
        } else {
            stats.misc.insert(key.to_owned(), value);
        }
    }

    stats
}
