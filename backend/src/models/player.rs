use serde::Serialize;
use uuid::Uuid;

#[derive(Debug, Serialize)]
pub struct Player {
    pub uuid: Uuid,
    pub username: String,
}
