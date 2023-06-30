mod hypixel;
mod models;
mod mojang;
mod processing;
mod routes;

use std::net::SocketAddr;

use axum::{routing::get, Router};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let _ = dotenv::dotenv();

    run().await
}

async fn hello() -> &'static str {
    "Hello, world!"
}

async fn run() -> std::io::Result<()> {
    let app = Router::new()
        .nest("/profile", routes::profile::route())
        .nest("/player", routes::player::route())
        .route("/", get(hello));

    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
    let _ = axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await;
    Ok(())
}
