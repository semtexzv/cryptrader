use crate::prelude::*;

pub use prometheus::*;
/*
use actix_web::Responder;

pub fn metric_export() -> impl Responder {
    let mut buffer = Vec::new();
    let encoder = TextEncoder::new();
    let metric_families = prometheus::gather();
    encoder.encode(&metric_families, &mut buffer).unwrap();
    String::from_utf8(buffer.clone()).unwrap()
}

pub fn make_exporting_app() -> actix_web::App {
    actix_web::App::new()
        .route("/metrics", actix_web::http::Method::GET, |_: actix_web::HttpRequest| metric_export())
}*/