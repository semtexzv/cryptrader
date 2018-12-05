#!/usr/bin/env bash

here=$(dirname -- "$(readlink -f -- "$BASH_SOURCE")")
source ${here}/env.sh


envsubst < ${here}/../kube/test.yaml | kubectl apply -f -