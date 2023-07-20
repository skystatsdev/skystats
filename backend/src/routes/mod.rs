pub mod leaderboards;
pub mod player;

use axum::{body::Bytes, http::Response, response::IntoResponse, Json, Router};
use http_body::combinators::UnsyncBoxBody;
use reqwest::StatusCode;
use thiserror::Error;

use crate::models;

pub type SkyResult<T> = Result<T, ApiError>;
pub type RouterResponse = Router<(), axum::body::Body>;

#[derive(Error, Debug)]
pub enum ApiError {
    #[error("Mojang API error: {0}")]
    Mojang(#[from] crate::mojang::MojangError),
    #[error("Hypixel API error: {0}")]
    Hypixel(#[from] crate::hypixel::HypixelError),

    #[error("Profile not found")]
    ProfileNotFound { username: String, profile: String },
    #[error("Leaderboard not found")]
    LeaderboardNotFound,

    #[error("Couldn't decode NBT: {0}")]
    Nbt(#[from] fastnbt::error::Error),
    #[error("Couldn't decode base64: {0}")]
    Base64(#[from] base64::DecodeError),
}

impl ApiError {
    fn status_code(&self) -> StatusCode {
        match self {
            ApiError::Mojang(_) | ApiError::Hypixel(_) | ApiError::Nbt(_) | ApiError::Base64(_) => {
                StatusCode::INTERNAL_SERVER_ERROR
            }
            ApiError::ProfileNotFound { .. } | ApiError::LeaderboardNotFound => {
                StatusCode::NOT_FOUND
            }
        }
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response<UnsyncBoxBody<Bytes, axum::Error>> {
        let status_code = self.status_code();

        let error = match self {
            ApiError::Mojang(_) => "mojang",
            ApiError::Hypixel(_) => "hypixel",
            ApiError::ProfileNotFound { .. } => "profile_not_found",
            ApiError::LeaderboardNotFound => "leaderboard_not_found",
            ApiError::Nbt(_) => "nbt",
            ApiError::Base64(_) => "base64",
        };

        let description = self.to_string();

        let api_error = models::error::ApiError {
            error,
            description: &description,
        };
        (status_code, Json(api_error)).into_response()
    }
}
