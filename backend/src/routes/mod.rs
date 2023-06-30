use actix_web::{error, HttpResponse};
use reqwest::StatusCode;
use thiserror::Error;

use crate::models;

pub mod player;
pub mod profile;

#[derive(Error, Debug)]
pub enum ApiError {
    #[error("Mojang API error: {0}")]
    Mojang(#[from] crate::mojang::MojangError),
    #[error("Hypixel API error: {0}")]
    Hypixel(#[from] crate::hypixel::HypixelError),
    #[error("Profile not found")]
    ProfileNotFound { username: String, profile: String },
}

impl error::ResponseError for ApiError {
    fn error_response(&self) -> HttpResponse {
        HttpResponse::build(self.status_code()).json(models::error::ApiError {
            error: match self {
                ApiError::Mojang(_) => "mojang",
                ApiError::Hypixel(_) => "hypixel",
                ApiError::ProfileNotFound { .. } => "profile_not_found",
            },
            description: &self.to_string(),
        })
    }

    fn status_code(&self) -> StatusCode {
        match *self {
            ApiError::Mojang(_) => StatusCode::INTERNAL_SERVER_ERROR,
            ApiError::Hypixel(_) => StatusCode::INTERNAL_SERVER_ERROR,
            ApiError::ProfileNotFound { .. } => StatusCode::NOT_FOUND,
        }
    }
}
