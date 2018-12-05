#!/bin/sh

here=$(dirname -- "$(readlink -f -- "$BASH_SOURCE")")

${here}/cargo-docker.sh build --package dp