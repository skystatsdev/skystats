use std::collections::HashMap;

use crate::models::profile::Stats;

pub fn process_stats(raw_stats: &HashMap<String, f64>) -> Stats {
    let mut stats = Stats::default();

    for (key, &value) in raw_stats {
        if let Some(mob_id) = key.strip_prefix("kills_") {
            stats.kills.total += value as u32;
            stats.kills.by_mob.insert(mob_id.to_owned(), value as u32);
        } else if let Some(mob_id) = key.strip_prefix("deaths_") {
            stats.deaths.total += value as u32;
            stats.deaths.by_mob.insert(mob_id.to_owned(), value as u32);
        } else {
            stats.misc.insert(key.to_owned(), value);
        }
    }

    stats
}
