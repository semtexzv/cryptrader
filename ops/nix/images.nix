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
    contents = [ bash coreutils ];

    config = {
      Entrypoint = [ "${bashInteractive}/bin/bash" ];
      WorkingDir = "/";
    };
  };

  with-ssl = dockerTools.buildImage {
    name = "with-ssl";
    tag = "latest";
    contents = [ openssl cacert ];
    fromImage = base;
  };

  postgres = dockerTools.buildImage {
    name = "postgres";
    tag = "latest";

    created = "now";

    contents = [ postgresql zeromq ];
    fromImage = with-ssl;
  };

  builder = dockerTools.buildImage {
    name = "builder";
    tag = "latest";

    created = "now";
    fromImage = with-ssl;

    contents  = [
    rustc
    cargo
    rust-std
    gcc
    pkgconfig
    binutils-unwrapped
    zeromq
    ];

    runAsRoot = "
    #!${stdenv.shell}
    mkdir -p /app
    ";

    config = {
      WorkingDir = "/app";
      Env = [
      "PKG_CONFIG_PATH=${zeromq}/lib/pkgconfig"
      ];
      Volumes = {
        "/app" = {};
        "/out" = {};
      };
    };

  };

}
