use axum::{extract::Path, routing::get, Json, Router};

use crate::{models::player::Player, mojang, processing};

use super::{RouterResponse, SkyResult};

pub fn route() -> RouterResponse {
    Router::new().route("/:user", get(player))
}

async fn player(Path(uuid_or_username): Path<String>) -> SkyResult<Json<Player>> {
    let mojang_profile = mojang::profile_from_username_or_uuid(&uuid_or_username).await?;

    Ok(Json(processing::player::player(mojang_profile.uuid).await?))
}
