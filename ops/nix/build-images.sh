#!/bin/sh
mkdir -p images

nix-build images.nix -A base -o images/base.tgz
nix-build images.nix -A postgres -o images/postgres.tgz 
nix-build images.nix -A builder -o images/builder.tgz 
