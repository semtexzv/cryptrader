#![feature(await_macro,  async_await, box_syntax)]
#![allow(dead_code, unused_variables, unused_imports, unreachable_code)]


pub mod prelude;

#[macro_use]
pub mod utils;

pub mod root;
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
use std::path::Path;
use actix_web::http::header::ContentType;

pub mod statics {
    include!(concat!(env!("OUT_DIR"), "/statics.rs"));
}


pub struct State {
    db: db::Database,
}

fn check<S>(_: &HttpRequest<S>) -> impl Responder { format!("I'm UP") }

pub fn static_file_named(name: &str) -> Result<impl Responder> {
    let mime = mime_guess::guess_mime_type(&Path::new(&name));
    if let Some(file) = statics::get(&name) {
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
    env::set_var("RUST_LOG", "debug");
    actix::System::run(|| {
        let db = db::start();
        server::new(move || {
            let mut app = App::with_state(State {
                db: db.clone(),
            });
            app = app.middleware(actix_web::middleware::Logger::default());
            // app = app.middleware(sentry_actix::SentryMiddleware::new());

            app = app.resource("/app/{tail:.*}", |r| r.method(http::Method::GET).with(|r: HttpRequest<State>| {
                static_file_named("index.html")
            }));

            app = root::configure(app);
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
    env::set_var("RUST_BACKTRACE", "full");

    // let _guard = sentry::init("https://46b76bb7e.c294a1a93859dca8b01d103@sentry.io/1339228");
    // sentry::integrations::panic::register_panic_handler();

    env_logger::Builder::from_default_env()
        .init();

    run();
}
