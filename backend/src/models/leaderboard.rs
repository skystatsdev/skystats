use serde::Serialize;
use uuid::Uuid;

use super::player::BasePlayer;

#[derive(Debug, Serialize, Clone)]
pub struct MemberLeaderboardEntry {
    pub player: BasePlayer,
    pub profile_uuid: Uuid,
    pub value: f64,
}

#[derive(Serialize)]
pub struct MemberLeaderboardResponse {
    pub slug: String,
    pub list: Vec<MemberLeaderboardEntry>,
}

#[derive(Serialize)]
pub struct LeaderboardListResponse {
    pub leaderboards: Vec<String>,
}
