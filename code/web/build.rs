extern crate ructe;


use ructe::{compile_templates, StaticFiles};
use std::env;
use std::path::PathBuf;
use std::fs::File;
use std::io::Write;

fn main() {
    let is_k8s = env::var("K8S_BUILD").is_ok();

    let out_dir = PathBuf::from(env::var("OUT_DIR").unwrap());
    let cargo_dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap());
    let work_dir = PathBuf::from(env::var("PWD").unwrap());

    let mut dump = File::create("/tmp/dump").expect("unable to open");
    for (k, v) in std::env::vars() {
        writeln!(&mut dump, "{} -> {}", k, v).expect("unable to write")
    }

    compile_templates(&cargo_dir.join("templates"), &out_dir).expect("compile templates");

    includedir::start(work_dir.join("code/web/static"))
        .dir(".")
        .passthrough(!is_k8s)
        .name("STATICS")
        .build("statics.rs")
        .unwrap();

/*
    let mut statics = StaticFiles::new(&out_dir).unwrap();
    statics.add_files(&cargo_dir.join("static")).unwrap();
    statics.add_sass_file("style/style.scss".as_ref()).unwrap();
    */

}
