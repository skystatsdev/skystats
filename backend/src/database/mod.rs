pub mod leaderboards;

use pg_embed::{
    pg_enums::PgAuthMethod,
    pg_fetch::{PgFetchSettings, PG_V15},
    postgres::{PgEmbed, PgSettings},
};
use sqlx::{postgres::PgPoolOptions, PgPool};
use std::{path::PathBuf, sync::Arc, time::Duration};
use tracing::info;

#[derive(Clone)]
pub struct Database {
    // the database stops when this is dropped, so we have to keep it here
    _embed: Arc<PgEmbed>,

    pub pool: PgPool,

    pub leaderboards: leaderboards::Leaderboards,
}

impl Database {
    pub async fn init() -> Self {
        info!("Initializing database");

        let pg_settings = PgSettings {
            database_dir: PathBuf::from("data/db"),
            port: 5432,
            user: "postgres".to_string(),
            // password doesn't matter since the database isn't public
            password: "postgres".to_string(),
            auth_method: PgAuthMethod::Plain,
            persistent: true,
            timeout: Some(Duration::from_secs(15)),
            // migrations are done with sqlx macros, so not here
            migration_dir: None,
        };

        // Postgresql binaries download settings
        let fetch_settings = PgFetchSettings {
            version: PG_V15,
            ..Default::default()
        };

        // Create a new instance
        let mut pg = PgEmbed::new(pg_settings, fetch_settings).await.unwrap();

        // Download, unpack, create password file and database cluster
        pg.setup().await.unwrap();

        // start postgresql database
        let _ = pg.start_db().await;

        if !pg.database_exists("skystats").await.unwrap() {
            pg.create_database("skystats").await.unwrap();
        }

        let pg_db_uri: String = pg.full_db_uri("skystats");

        let pool = PgPoolOptions::new()
            .max_connections(5)
            .connect(&pg_db_uri)
            .await
            .unwrap();

        sqlx::migrate!("src/database/migrations")
            .run(&pool)
            .await
            .expect("running database migrations should never fail");

        info!("Finished initializing database");

        Self {
            leaderboards: leaderboards::Leaderboards::init(&pool).await,
            _embed: Arc::new(pg),
            pool,
        }
    }
}
