use actix_web::{error, HttpResponse};
use reqwest::StatusCode;
use thiserror::Error;

use crate::models;

pub mod player;

#[derive(Error, Debug)]
pub enum ApiError {
    #[error("Mojang API error: {0}")]
    Mojang(#[from] crate::mojang::MojangError),
}

impl error::ResponseError for ApiError {
    fn error_response(&self) -> HttpResponse {
        HttpResponse::build(self.status_code()).json(models::error::ApiError {
            error: match self {
                ApiError::Mojang(_) => "mojang",
            },
            description: &self.to_string(),
        })
    }

    fn status_code(&self) -> StatusCode {
        match *self {
            ApiError::Mojang(_) => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }
}
