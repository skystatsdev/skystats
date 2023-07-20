use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct MemberLeaderboardEntry {
    pub player_uuid: Uuid,
    pub profile_uuid: Uuid,
    pub value: f64,
}

#[derive(Serialize, Deserialize)]
pub struct MemberLeaderboardResponse {
    pub slug: String,
    pub list: Vec<MemberLeaderboardEntry>,
}

#[derive(Serialize, Deserialize)]
pub struct LeaderboardListResponse {
    pub leaderboards: Vec<String>,
}
