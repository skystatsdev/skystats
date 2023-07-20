use std::{
    collections::{HashMap, HashSet},
    fmt,
    str::FromStr,
    sync::Arc,
};

use dashmap::DashMap;
use sqlx::{Column, PgPool, QueryBuilder, Row};
use tracing::{info, warn};

use crate::models::{
    leaderboard::MemberLeaderboardEntry,
    player::{BasePlayer, Rank},
    profile::ProfileMember,
};

#[derive(Default, Clone)]
pub struct Leaderboards {
    // there's two types of leaderboards, member leaderboards and profile leaderboards
    pub member_leaderboards: Arc<DashMap<MemberLeaderboardKind, Vec<MemberLeaderboardEntry>>>,
}

// 1000 leaderboards takes up roughly 500mb in memory
const LEADERBOARD_SIZE: usize = 1000;

impl Leaderboards {
    pub async fn init(pool: &PgPool) -> Self {
        let leaderboards = Self::default();

        let member_leaderboards = sqlx::query(
            r#"
                SELECT *
                FROM member_leaderboards
            "#,
        )
        .fetch_all(pool)
        .await
        .unwrap();

        let mut leaderboard_names = HashSet::new();

        for entry in member_leaderboards {
            // each row is a member and each column is a leaderboard
            for (kind, value) in entry
                .columns()
                .iter()
                .filter_map(|column| {
                    let kind = MemberLeaderboardKind::from_str(column.name()).ok()?;
                    leaderboard_names.insert(kind.clone());
                    let value = entry.try_get::<f64, _>(column.name()).ok()?;
                    Some((kind, value))
                })
                .collect::<Vec<_>>()
            {
                let mut leaderboard = leaderboards
                    .member_leaderboards
                    .entry(kind)
                    .or_insert_with(Vec::new);
                // leaderboards get sorted later
                leaderboard.push(MemberLeaderboardEntry {
                    player: BasePlayer {
                        uuid: entry.try_get("player_uuid").unwrap(),
                        username: entry.try_get("player_username").unwrap(),
                        rank: Rank {
                            name: entry.try_get("player_rank_name").unwrap(),
                            color: entry.try_get("player_rank_color").unwrap(),
                            plus_color: entry.try_get("player_rank_plus_color").unwrap(),
                            formatted: entry.try_get("player_rank_formatted").unwrap(),
                        },
                    },
                    profile_uuid: entry.try_get("profile_uuid").unwrap(),
                    value,
                });
            }
        }

        // sort leaderboards
        for mut leaderboard in leaderboards.member_leaderboards.iter_mut() {
            let leaderboard_kind = leaderboard.key().clone();
            leaderboard_kind.sort(&mut leaderboard);
            if leaderboard.len() > LEADERBOARD_SIZE {
                let name = leaderboard.key();
                warn!(
                    "Leaderboard {name} is too big, truncating from {} to {LEADERBOARD_SIZE}",
                    leaderboard.len()
                );
                leaderboard.truncate(LEADERBOARD_SIZE);
            }
        }

        // add the empty leaderboards
        for kind in leaderboard_names {
            if leaderboards.member_leaderboards.get(&kind).is_none() {
                leaderboards.member_leaderboards.insert(kind, Vec::new());
            }
        }

        leaderboards
    }

    pub async fn update_member(&mut self, pool: &PgPool, member: &ProfileMember) {
        let leaderboards = leaderboards_for_member(member);

        // create new leaderboards if they don't exist
        for kind in leaderboards.keys() {
            if self.member_leaderboards.get(kind).is_none() {
                self.create_new_leaderboard(pool, kind).await;
            }
        }

        let mut popped: Vec<(MemberLeaderboardKind, MemberLeaderboardEntry)> = Vec::new();

        for (kind, &value) in &leaderboards {
            let entry = MemberLeaderboardEntry {
                player: member.player.base.clone(),
                profile_uuid: member.profile.uuid,
                value,
            };
            let mut leaderboard = self.member_leaderboards.get_mut(kind).unwrap();

            // check if we're already in the leaderboard
            if let Some(index) = leaderboard.iter().position(|entry| {
                entry.player.uuid == member.player.base.uuid
                    && entry.profile_uuid == member.profile.uuid
            }) {
                if leaderboard[index].value != value {
                    leaderboard[index].value = value;
                    kind.sort(&mut leaderboard);
                    println!("updated {kind} for {}", member.player.base.uuid);
                }
            } else {
                let index = kind.insertion_index(&leaderboard, value);
                if index < LEADERBOARD_SIZE {
                    leaderboard.insert(index, entry);
                    println!("added to {kind}");
                    if leaderboard.len() > LEADERBOARD_SIZE {
                        let entry = leaderboard.pop().expect("there should be something to pop");
                        popped.push((kind.clone(), entry));
                    }
                }
            }
        }

        // update database

        info!(
            "Updating leaderboards for {}: {:?}",
            member.player.base.username, leaderboards
        );
        let query = sqlx::query(
            r#"
                INSERT INTO member_leaderboards(player_uuid, profile_uuid)
                VALUES ($1, $2)
                ON CONFLICT DO NOTHING
            "#,
        )
        .bind(member.player.base.uuid)
        .bind(member.profile.uuid);
        query.execute(pool).await.unwrap();

        // update member_leaderboards
        let mut query = QueryBuilder::new(format!(
            "UPDATE member_leaderboards
            SET "
        ));
        for (i, (kind, value)) in leaderboards.iter().enumerate() {
            query.push(format!("{kind} = {value}"));
            if i != leaderboards.len() - 1 {
                query.push(",");
            }
            query.push(" ");
        }
        query.push(format!(
            "WHERE player_uuid = '{player_uuid}'
            AND profile_uuid = '{profile_uuid}'",
            player_uuid = member.player.base.uuid,
            profile_uuid = member.profile.uuid
        ));
        query.build().execute(pool).await.unwrap();

        // update the popped entries (members who were pushed out of the leaderboard)
        for (kind, entry) in popped {
            let mut query = QueryBuilder::new(format!(
                "UPDATE member_leaderboards
                SET {kind} = NULL
                WHERE player_uuid = '{player_uuid}'
                AND profile_uuid = '{profile_uuid}'",
                player_uuid = entry.player.uuid,
                profile_uuid = entry.profile_uuid
            ));
            query.build().execute(pool).await.unwrap();
            println!("popped {} from {kind}", entry.player.uuid);
        }
    }

    async fn create_new_leaderboard(&mut self, pool: &PgPool, kind: &MemberLeaderboardKind) {
        // i sure hope this doesn't result in sql injection by the hypixel admins creating a new
        // leaderboard that happens to be an sql command

        info!("Creating new leaderboard: {kind}");
        let mut query = QueryBuilder::new(format!(
            "ALTER TABLE member_leaderboards
            ADD COLUMN {kind} float8"
        ));
        query.build().execute(pool).await.unwrap();

        self.member_leaderboards.insert(kind.clone(), Vec::new());
    }
}

#[derive(Debug, Eq, PartialEq, Hash, Clone)]
pub enum MemberLeaderboardKind {
    Kills(String),
    TotalKills,
    Deaths(String),
    TotalDeaths,
}

impl fmt::Display for MemberLeaderboardKind {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            MemberLeaderboardKind::Kills(mob) => write!(f, "kills_{mob}"),
            MemberLeaderboardKind::TotalKills => write!(f, "kills"),
            MemberLeaderboardKind::Deaths(mob) => write!(f, "deaths_{mob}"),
            MemberLeaderboardKind::TotalDeaths => write!(f, "deaths"),
        }
    }
}
impl FromStr for MemberLeaderboardKind {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        if let Some(mob) = s.strip_prefix("kills_") {
            return Ok(MemberLeaderboardKind::Kills(mob.to_string()));
        }
        if s == "kills" {
            return Ok(MemberLeaderboardKind::TotalKills);
        }
        if let Some(mob) = s.strip_prefix("deaths_") {
            return Ok(MemberLeaderboardKind::Deaths(mob.to_string()));
        }
        if s == "deaths" {
            return Ok(MemberLeaderboardKind::TotalDeaths);
        }
        Err(())
    }
}

pub enum SortOrder {
    HighestFirst,
    LowestFirst,
}

impl MemberLeaderboardKind {
    pub fn sort_order(&self) -> SortOrder {
        SortOrder::HighestFirst
    }
    pub fn sort(&self, leaderboard: &mut [MemberLeaderboardEntry]) {
        match self.sort_order() {
            SortOrder::HighestFirst => leaderboard.sort_by(|a, b| {
                a.value
                    .partial_cmp(&b.value)
                    .unwrap_or(std::cmp::Ordering::Equal)
                    .reverse()
            }),
            SortOrder::LowestFirst => leaderboard.sort_by(|a, b| {
                a.value
                    .partial_cmp(&b.value)
                    .unwrap_or(std::cmp::Ordering::Equal)
            }),
        }
    }
    pub fn insertion_index(&self, leaderboard: &[MemberLeaderboardEntry], value: f64) -> usize {
        match self.sort_order() {
            SortOrder::HighestFirst => leaderboard
                .binary_search_by(|entry| {
                    entry
                        .value
                        .partial_cmp(&value)
                        .unwrap_or(std::cmp::Ordering::Equal)
                        .reverse()
                })
                .unwrap_or_else(|index| index),
            SortOrder::LowestFirst => leaderboard
                .binary_search_by(|entry| {
                    entry
                        .value
                        .partial_cmp(&value)
                        .unwrap_or(std::cmp::Ordering::Equal)
                })
                .unwrap_or_else(|index| index),
        }
    }
}

fn leaderboards_for_member(member: &ProfileMember) -> HashMap<MemberLeaderboardKind, f64> {
    let mut leaderboards: HashMap<MemberLeaderboardKind, f64> = HashMap::new();

    for (mob, &amount) in member.stats.kills.by_mob.iter() {
        leaderboards.insert(MemberLeaderboardKind::Kills(mob.to_string()), amount.into());
    }
    leaderboards.insert(
        MemberLeaderboardKind::TotalKills,
        member.stats.kills.total.into(),
    );

    for (mob, &amount) in member.stats.deaths.by_mob.iter() {
        leaderboards.insert(
            MemberLeaderboardKind::Deaths(mob.to_string()),
            amount.into(),
        );
    }
    leaderboards.insert(
        MemberLeaderboardKind::TotalDeaths,
        member.stats.deaths.total.into(),
    );

    leaderboards
}
