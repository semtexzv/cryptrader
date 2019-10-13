#![feature(box_syntax)]
#![allow(dead_code, unused_variables, unused_imports, unreachable_code)]


pub mod prelude;

#[macro_use]
pub mod utils;

pub mod root;
pub mod ohlc;
pub mod users;
pub mod traders;
pub mod strategies;
pub mod assignments;

pub mod evaluations;
pub mod trades;

use crate::prelude::*;
use crate::utils::*;
use actix_web::HttpResponse;
use db::Database;
use std::path::{Path, PathBuf};
use actix_web::http::header::ContentType;

pub struct State {
    db: db::Database,
}

fn check<S>(_: &HttpRequest<S>) -> impl Responder { format!("I'm UP") }

pub fn static_file_named(name: &str) -> Result<impl Responder> {
    warn!("Returning : {:?}", name);
    let name = name.replace("..", "").to_string();
    let mut path = PathBuf::from(env::var("WEBAPP_ROOT").unwrap_or("./code/web/app/dist".to_string()));
    path.push(&name);
    let mime = mime_guess::from_path(&path).first_or_octet_stream();
    if let Ok(file) = std::fs::read(path) {
        Ok(HttpResponse::Ok().header(http::header::CONTENT_TYPE, ContentType(mime)).body(file))
    } else {
        Ok(HttpResponse::NotFound().body(""))
    }
}

pub fn static_file(req: HttpRequest<State>) -> Result<impl Responder> {
    let name: String = req.match_info().query("tail").unwrap();
    info!("Retrieving : {:?}", name);

    return static_file_named(&name);
}

pub fn run() {
    common::ak::rt::run(async move {
        let db = db::start();
        server::new(move || {
            /*
            let server = common::actix_web::server::new(||{
                common::metrics::make_exporting_app()
            }).bind("0.0.0.0:9000").unwrap().start();
            */

            let mut app = App::with_state(State {
                db: db.clone(),
            });
            app = app.middleware(actix_web::middleware::Logger::default());

            app = app.resource("/app/{tail:.*}", |r| r.method(http::Method::GET).with(|r: HttpRequest<State>| {
                static_file_named("index.html")
            }));

            app = root::configure(app);
            app = ohlc::configure(app);
            app = users::configure(app);

            app = strategies::configure(app);
            app = assignments::configure(app);
            app = evaluations::configure(app);
            app = trades::configure(app);
            app = traders::configure(app);


            app
                .resource("/healthy", |r| r.method(http::Method::GET).f(check))
                .resource("/ready", |r| r.method(http::Method::GET).f(check))
                .resource("/static/{tail:.*}", |r| r.method(http::Method::GET).with(static_file))
                .default_resource(|r| r.h(http::NormalizePath::default()))
        }).bind("0.0.0.0:8000").unwrap().start();
    });
}

fn main() {
    common::init();

    run();
}
