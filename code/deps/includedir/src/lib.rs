#![recursion_limit = "128"]

extern crate walkdir;
extern crate flate2;
#[macro_use]
extern crate quote;
extern crate glob;

use std::{env, fmt, io};
use std::borrow::{Borrow, Cow};
use std::collections::HashMap;
use std::fs::{self, File};
use std::io::{BufReader, BufWriter, Write};
use std::path::{Path, PathBuf};

use walkdir::WalkDir;

#[cfg(windows)]
fn as_key(path: &str) -> Cow<str> {
    Cow::Owned(path.replace("\\", "/"))
}

#[cfg(not(windows))]
fn as_key(path: &str) -> Cow<str> {
    Cow::Borrowed(path)
}

pub struct IncludeDir {
    files: HashMap<String, PathBuf>,
    base: PathBuf,
    name: String,
    passthrough: bool,
    compress: bool,
}

pub fn start(base_path: impl AsRef<Path>) -> IncludeDir {
    IncludeDir {
        files: HashMap::new(),
        name: "".into(),
        base: base_path.as_ref().clone().to_owned(),
        passthrough: false,
        compress: false,
    }
}

impl IncludeDir {
    pub fn name(&mut self, name: &str) -> &mut IncludeDir {
        self.name = name.into();
        return self;
    }

    pub fn passthrough(&mut self, pass: bool) -> &mut IncludeDir {
        self.passthrough = pass;
        self
    }
    pub fn compress(&mut self, compress: bool) -> &mut IncludeDir {
        self.compress = compress;
        self
    }


    pub fn add(&mut self, path: &str ) -> &mut IncludeDir {
        for entry in glob::glob(path).unwrap() {

        }

        self
    }

    /// Add a single file to the binary.
    /// With Gzip compression, the file will be encoded to OUT_DIR first.
    /// For chaining, it's not sensible to return a Result. If any to-be-included
    /// files can't be found, or encoded, this function will panic!.
    pub fn file(&mut self, path: impl AsRef<Path>) -> &mut IncludeDir {
        {
            let key = path.as_ref().to_owned();
            let key = key.strip_prefix(&self.base).unwrap().to_string_lossy();
            self.files.insert(as_key(key.borrow()).into_owned(), path.as_ref().clone().to_owned());
        }
        self
    }


    /// Add a whole directory recursively to the binary.
    /// This function calls `file`, and therefore will panic! on missing files.
    pub fn dir(&mut self, path: impl AsRef<Path>) -> &mut IncludeDir {
        let dir_path = self.base.join(path);

        for entry in WalkDir::new(dir_path).follow_links(true).into_iter() {
            match entry {
                Ok(ref e) if !e.file_type().is_dir() => {
                    self.file(e.path());
                }
                _ => (),
            }
        }

        self
    }


    pub fn build(&self, out_name: &str) -> io::Result<()> {
        let base_path = Path::new(&env::var("CARGO_MANIFEST_DIR").unwrap()).to_owned();
        let out_path = Path::new(&env::var("OUT_DIR").unwrap()).join(out_name);
        let mut out_file = BufWriter::new(File::create(&out_path)?);

        let base_tokens = self.base.display().to_string();
        let lines = if self.passthrough {
            quote! {
                fn read_file_dynamic<P : AsRef<::std::path::Path>>(path: P) -> Option<Vec<u8>> {
                    use ::std::io::Read;
                    let mut data = Vec::new();
                    if let Ok(mut file) = ::std::fs::File::open(path) {
                        let _ = file.read_to_end(&mut data);
                        return Some(data);
                    } else {
                        return None;
                    }
                }

                let base = ::std::path::Path::new(#base_tokens);
                return read_file_dynamic(base.join(name));
            }
        } else {
            let mut lines = quote!();
            for (k, path) in self.files.iter() {
                let full_path = format!("{}", base_path.join(path).display());
                //let path_tokens = path.display().to_string();

                let line =  if self.compress {
                    let mut in_file = BufReader::new(File::open(&full_path)?);
                    let item_out_path = Path::new(&env::var("OUT_DIR").unwrap()).join(&path);
                    fs::create_dir_all(&item_out_path.parent().unwrap())?;
                    let out_file = BufWriter::new(File::create(&item_out_path)?);
                    let mut encoder = flate2::write::GzEncoder::new(out_file, ::flate2::Compression::fast());
                    io::copy(&mut in_file, &mut encoder)?;

                    let include_path = item_out_path.display().to_string();
                    quote! { #k => Some(decode(&include_bytes!(#include_path)[..])), }

                } else {
                    quote! { #k => Some(Vec::from(&include_bytes!(#full_path)[..])), }

                };

                lines = quote! {
                    #lines
                    #line
                };

            }

            let mut prefix = if self.compress {
                quote! {
                    use ::flate2;
                    fn decode<D: AsRef<[u8]>>(data: D) -> Vec<u8> {
                        use ::std::io::{
                            Read,
                            Cursor,
                        };
                        let input = data.as_ref();
                        let mut res = Vec::new();
                        flate2::read::GzDecoder::new(Cursor::new(&input)).read_to_end(&mut res).unwrap();
                        assert_ne!(res.len(), 0);
                        res
                    }
                }
            } else {
                quote!()
            };

            quote! {
                #![allow(unused_must_use)]
                #prefix
                match name {
                    #lines
                    _ => None,
                }
            }

        };


        let def = quote! {
            pub fn get(name : &str) -> Option<Vec<u8>> {
                #lines
            }
        };

        writeln!(&mut out_file, "{}", def)?;

        Ok(())
    }
}

