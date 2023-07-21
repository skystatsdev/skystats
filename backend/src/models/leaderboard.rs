use serde::Serialize;
use uuid::Uuid;

use super::player::BasePlayer;

#[derive(Debug, Serialize, Clone)]
pub struct MemberLeaderboardEntry {
    pub player: BasePlayer,
    pub profile: MemberLeaderboardProfile,
    pub value: f64,
}

#[derive(Serialize)]
pub struct MemberLeaderboardResponse {
    pub slug: String,
    pub list: Vec<MemberLeaderboardEntry>,
}

#[derive(Debug, Serialize, Clone)]
pub struct MemberLeaderboardProfile {
    pub uuid: Uuid,
    pub name: String,
}

#[derive(Serialize)]
pub struct LeaderboardListResponse {
    pub leaderboards: Vec<LeaderboardListEntry>,
}

#[derive(Serialize, PartialEq, PartialOrd, Eq, Ord)]
pub struct LeaderboardListEntry {
    pub slug: String,
}
