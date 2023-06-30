mod hypixel;
mod models;
mod mojang;
mod process;
mod routes;

use actix_web::{get, App, HttpResponse, HttpServer, Responder};

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let _ = dotenv::dotenv();

    if std::env::var("HYPIXEL_API_KEY").is_err() {
        panic!("HYPIXEL_API_KEY must be set");
    }

    HttpServer::new(move || App::new().service(hello).configure(routes::player::config))
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}
