#!/bin/sh

here=$(dirname -- "$(readlink -f -- "$BASH_SOURCE")")
source ${here}/env.sh

mkdir -p images
IMAGE=${1?"Missing image name argument"}

nix-build ops/nix/images.nix -A ${IMAGE} -o images/${IMAGE}.tgz

docker load < images/${IMAGE}.tgz

function GoogleTag() {
    docker tag $1 eu.gcr.io/${PROJECT_ID}/$1
}

function DockerTag() {
    docker tag $1 semtexzv/$1
}

GoogleTag ${IMAGE}
DockerTag ${IMAGE}
