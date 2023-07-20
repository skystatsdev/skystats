use std::str::FromStr;

use axum::{extract::Path, routing::get, Extension, Json, Router};

use crate::{
    database::leaderboards::MemberLeaderboardKind,
    models::leaderboard::{LeaderboardListResponse, MemberLeaderboardResponse},
    Context,
};

use super::{ApiError, RouterResponse, SkyResult};

pub fn route() -> RouterResponse {
    Router::new()
        .route("/", get(list_leaderboards))
        .route("/:slug", get(get_leaderboard))
}

async fn list_leaderboards(ctx: Extension<Context>) -> SkyResult<Json<LeaderboardListResponse>> {
    let mut leaderboards: Vec<String> = ctx
        .database
        .leaderboards
        .member_leaderboards
        .iter()
        .map(|l| l.key().clone())
        .map(|kind| kind.to_string())
        .collect();
    leaderboards.sort();
    Ok(Json(LeaderboardListResponse { leaderboards }))
}

async fn get_leaderboard(
    ctx: Extension<Context>,
    Path(slug): Path<String>,
) -> SkyResult<Json<MemberLeaderboardResponse>> {
    let leaderboard_kind =
        MemberLeaderboardKind::from_str(&slug).map_err(|_| ApiError::LeaderboardNotFound)?;

    let list = ctx
        .database
        .leaderboards
        .member_leaderboards
        .get(&leaderboard_kind)
        .ok_or(ApiError::LeaderboardNotFound)?
        .clone();

    Ok(Json(MemberLeaderboardResponse { slug, list }))
}
