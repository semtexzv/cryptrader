extern crate ructe;


use ructe::{compile_templates, StaticFiles};
use std::env;
use std::path::PathBuf;


fn main() {
    let out_dir = PathBuf::from(env::var("OUT_DIR").unwrap());
    let cargo_dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap());
    let mut file_path = PathBuf::from(file!());
    file_path.pop();

    let workdir_rel = file_path;
    //panic!("Workdir relative : {:?}", workdir_rel);


    compile_templates(&cargo_dir.join("templates"), &out_dir).expect("compile templates");

    includedir::start( workdir_rel.join("static"))
        .dir(".")
        .passthrough(true)
        .name("STATICS")
        .build("statics.rs")
        .unwrap();

/*
    let mut statics = StaticFiles::new(&out_dir).unwrap();
    statics.add_files(&cargo_dir.join("static")).unwrap();
    statics.add_sass_file("style/style.scss".as_ref()).unwrap();
    */

}
