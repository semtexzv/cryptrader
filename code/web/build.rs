extern crate ructe;


use ructe::{compile_templates, StaticFiles};
use std::env;
use std::path::PathBuf;
use std::fs::File;
use std::io::Write;

fn main() {
    println!("rerun-if-env-changed=K8S_BUILD");
    let is_k8s = env::var("K8S_BUILD").is_ok();

    let out_dir = PathBuf::from(env::var("OUT_DIR").unwrap());
    let cargo_dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap());


    compile_templates(&cargo_dir.join("templates"), &out_dir).expect("compile templates");

    includedir::start(cargo_dir.join(PathBuf::from("../../code/web/static")))
        .dir(".")
        .passthrough(!is_k8s)
        .name("STATICS")
        .build("statics.rs")
        .unwrap();

}
