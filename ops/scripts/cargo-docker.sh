#!/bin/env bash
input=$(pwd)
output=$input/target/dockerized

mkdir -p ${output}

input=$(realpath $input)
output=$(realpath $output)

cmd=${1:-build}
shift 1
args=${@:-"--release --all"}

docker run -t --rm \
     --user $(id -u):$(id -g)  \
    -v "$HOME"/.cargo:/usr/local/cargo/ \
    -v "$HOME"/.cargo:/root/.cargo/ \
    -v "$HOME"/.cargo:/.cargo/ \
    -v ${input}:/app \
    -v ${output}:/out \
    builder:latest bash "useradd" -u `id -u` $USER" %% cargo "${cmd} --target-dir /out ${args}