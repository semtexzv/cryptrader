#![feature(await_macro, futures_api, async_await, box_syntax)]
#![allow(dead_code, unused_variables, unused_imports, unreachable_code)]


pub mod prelude;
pub mod pages;
pub mod strategies;
pub mod utils;
pub mod users;

use crate::prelude::*;
use crate::utils::*;
use actix_web::HttpResponse;

include!(concat!(env!("OUT_DIR"), "/templates.rs"));

pub struct State {
    db: Addr<db::Database>
}

fn check<S>(_: &HttpRequest<S>) -> impl Responder { format!("I'm UP") }

/*
pub fn static_file(req: HttpRequest<State>) -> Result<impl Responder> {
    let name: String = req.match_info().query("tail")?;
    let file = crate::templates::statics::StaticFile::get(&name).unwrap();
    Ok(HttpResponse::Ok().content_type(file.mime.to_string()).body(file.content))
}
*/
pub fn run() {
    server::new(move || {
        let mut app = App::with_state(State {
            db: db::start(),
        });
        app = app.middleware(actix_web::middleware::Logger::default());
        // app = app.middleware(sentry_actix::SentryMiddleware::new());

        app = pages::configure(app);
        app = strategies::configure(app);
        app = users::configure(app);

        app
            .resource("/healthy", |r| r.method(http::Method::GET).f(check))
            .resource("/ready", |r| r.method(http::Method::GET).f(check))
            .handler("/static", actix_web::fs::StaticFiles::new("code/web/static").unwrap().show_files_listing())
            //.resource("/static/{tail:.*}",|r| r.method(http::Method::GET).with(static_file))
            .default_resource(|r| r.h(http::NormalizePath::default()))
    })

        .bind("0.0.0.0:8000").unwrap()
        .run();
}

fn main() {
    env::set_var("RUST_BACKTRACE", "full");

    // let _guard = sentry::init("https://46b76bb7e.c294a1a93859dca8b01d103@sentry.io/1339228");
    // sentry::integrations::panic::register_panic_handler();

    env_logger::Builder::from_default_env()
        .init();

    run();
}
