mod database;
mod hypixel;
mod models;
mod mojang;
mod processing;
mod routes;

use std::net::SocketAddr;

use axum::{routing::get, Extension, Router};
use tracing::info;

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let _ = dotenv::dotenv();

    let subscriber = tracing_subscriber::FmtSubscriber::builder()
        .with_env_filter(
            tracing_subscriber::EnvFilter::builder()
                .with_default_directive("skystats=debug".parse().unwrap())
                .from_env_lossy(),
        )
        .finish();
    tracing::subscriber::set_global_default(subscriber).expect("setting default subscriber failed");

    run().await
}

async fn hello() -> &'static str {
    "skystats backend :)\n\nSource code: https://github.com/skystatsdev/skystats/tree/main/backend"
}

/// Data that's shared across all requests.
#[derive(Clone)]
pub struct Context {
    pub database: database::Database,
}

async fn run() -> std::io::Result<()> {
    let context = Context {
        database: database::Database::init().await,
    };

    let app = Router::new()
        .nest("/player", routes::player::route())
        .nest("/leaderboards", routes::leaderboards::route())
        .route("/", get(hello))
        .layer(Extension(context));

    let port = 8000;

    info!("Listening on http://localhost:{port}");
    let addr = SocketAddr::from(([0, 0, 0, 0], port));

    let _ = axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await;
    Ok(())
}
