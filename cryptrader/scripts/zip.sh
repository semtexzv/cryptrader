#!/usr/bin/env bash
loc=$(dirname $(dirname $(realpath $0)))
cd $loc

outfile=pkg.zip
infiles=

zip -0 $outfile -j ./target/debug/trader
zip -0 $outfile -j ./target/debug/daemon
zip -1 $outfile  Cargo.toml
zip -1 $outfile -r ./migrations
zip -1 $outfile -r ./scripts