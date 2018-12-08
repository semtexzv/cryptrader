#![feature(await_macro, futures_api, async_await, box_syntax)]
#![allow(dead_code, unused_variables, unused_imports, unreachable_code)]


pub mod prelude;
pub mod pages;
pub mod utils;
pub mod users;
pub mod files;

use crate::prelude::*;
use crate::utils::*;

pub struct State {
    db: Addr<db::Database>
}

fn check<S>(_: &HttpRequest<S>) -> impl Responder {
    format!("I'm UP")

}

fn fail<S>(_: &HttpRequest<S>) -> impl Responder {
    panic!("I'm UP");
    "B"
}

pub fn run() {
    server::new(move || {
        let mut app = App::with_state(State {
            db: db::start(),
        });
        app = app.middleware(actix_web::middleware::Logger::default());
        app = app.middleware(sentry_actix::SentryMiddleware::new());

        app = files::configure(app);
        app = pages::configure(app);
        app = users::configure(app);

        app
            .resource("/healthy", |r| r.method(http::Method::GET).f(check))
            .resource("/ready", |r| r.method(http::Method::GET).f(check))
            .resource("/fail", |r| r.method(http::Method::GET).f(fail))
            .default_resource(|r| r.h(http::NormalizePath::default()))
    })
        .bind("0.0.0.0:80").unwrap()
        .start();
}

fn main() {
    env::set_var("RUST_BACKTRACE", "1");
    env::set_var("RUST_LOG", "actix_web=debug,diesel=debug,info,warn");

    let _guard = sentry::init("https://46b76bb7ec294a1a93859dca8b01d103@sentry.io/1339228");
    sentry::integrations::panic::register_panic_handler();

    env_logger::Builder::from_default_env()
        .init();

    common::actix::System::run(move || {
        run();
    });
}
