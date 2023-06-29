use serde::Serialize;

#[derive(Serialize)]
pub struct ApiError<'a> {
    pub error: &'a str,
    pub description: &'a str,
}
