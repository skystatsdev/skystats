use std::net::SocketAddr;

use axum::{routing::get, Router};
use tower_http::{
    services::{ServeDir, ServeFile},
};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let _ = dotenv::dotenv();

    let subscriber = tracing_subscriber::FmtSubscriber::builder()
        .with_env_filter(
            tracing_subscriber::EnvFilter::builder()
                .with_default_directive(tracing::level_filters::LevelFilter::INFO.into())
                .from_env_lossy(),
        )
        .finish();
    tracing::subscriber::set_global_default(subscriber).expect("setting default subscriber failed");

    run().await
}

async fn hello() -> &'static str {
    "Hello, world!"
}

async fn run() -> std::io::Result<()> {
    let app = Router::new()
        .nest_service("/assets", ServeDir::new("files"))
        .route("/", get(hello));

    let addr = SocketAddr::from(([127, 0, 0, 1], 5555));
    let _ = axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await;
    Ok(())
}
