use thiserror::Error;

use crate::mojang;

pub mod player;

#[derive(Error, Debug)]
pub enum ProcessError {
    #[error("Mojang API error: {0}")]
    Mojang(#[from] mojang::MojangError),
}
