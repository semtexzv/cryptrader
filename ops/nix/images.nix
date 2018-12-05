{ nixpkgs ? import <nixpkgs> {} }:

with nixpkgs;
rec {

  nightly-date = "2018-10-10";

  nightly = let
    moz_overlay = import (builtins.fetchTarball https://github.com/mozilla/nixpkgs-mozilla/archive/master.tar.gz);
    overlayed = import <nixpkgs> { overlays = [ moz_overlay ]; };
  in (overlayed.rustChannelOf { date = nightly-date ; channel = "nightly"; });

  rustc = nightly.rustc;
  cargo = nightly.cargo;
  rust-std  = nightly.rust-std;
  openssl = openssl_1_1;
  postgresql= postgresql100;


  base = dockerTools.buildImage {
    name = "base";
    tag = "latest";
    runAsRoot = "
    #!${stdenv.shell}
    ${dockerTools.shadowSetup}
    mkdir -p /tmp
    ";
    contents = [ bashInteractive coreutils sudo openssl cacert file ];

    config = {
      Entrypoint = [ "${bashInteractive}/bin/bash" ];
      WorkingDir = "/";
    };
  };
  postgres = dockerTools.buildImage {
    name = "postgres";
    tag = "latest";

    created = "now";

    contents = [ postgresql zeromq ];
    fromImage = base;
  };

  builder = dockerTools.buildImage {
    name = "builder";
    tag = "latest";

    created = "now";
    fromImage = base;

    contents  = [
    rustc
    cargo
    rust-std
    gcc
    pkgconfig
    binutils-unwrapped
    zeromq
    ];

    runAsRoot = ''
    #!${stdenv.shell}
    mkdir -p /app
    '';

    config = {
      WorkingDir = "/app";
      Env = [
      "PKG_CONFIG_PATH=${zeromq}/lib/pkgconfig"
      ];
      Volumes = {
        "/app" = {};
        "/out" = {};
        "/usr/local/cargo" = {};
      };
    };

  };

  runner = dockerTools.buildImage {
    name = "runner";
    tag = "latest";

    created = "now";
    fromImage = base;

    contents = [ zeromq ];
  };

  dp = stdenv.mkDerivation {
    name = "dp";
    src = ../../target/debug/dp;
    unpackCmd=''
    set -x
      mkdir -p dp
      for i in $srcs; do
        ls $i
      done
    '';

  };

  final = dockerTools.buildImage {
    name = "final";
    tag = "latest";
    created = "now";
    fromImage = runner;
    contents = [ dp ];
    };
}
