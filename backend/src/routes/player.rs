use actix_web::{get, web, Responder};

use crate::{mojang, processing, routes::ApiError};

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("player").service(player));
}

#[get("{user}")]
async fn player(path: web::Path<String>) -> Result<impl Responder, ApiError> {
    let uuid_or_username = path.into_inner();
    let mojang_profile = mojang::profile_from_username_or_uuid(&uuid_or_username).await?;

    Ok(web::Json(
        processing::player::player(mojang_profile.uuid).await?,
    ))
}
