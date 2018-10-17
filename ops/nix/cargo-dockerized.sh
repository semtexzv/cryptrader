#!/bin/env bash
input=$(pwd)
output=$input/targets

mkdir -p ${output}

input=$(realpath $input)
output=$(realpath $output)

cmd=${1:-build}
shift 1
args=${@:-"--release --all"}

docker run -v ${input}:/app -v ${output}:/out --entrypoint "bash" -it builder:latest cargo ${cmd} --target-dir /out $args
