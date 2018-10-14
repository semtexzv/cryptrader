#!/usr/bin/env bash
loc=$(dirname $(dirname $(realpath $0)))
cd $loc

HOST="ubuntu@ec2-18-196-86-128.eu-central-1.compute.amazonaws.com"

cargo build --all

./scripts/zip.sh

scp -C -i "collector.pem" pkg.zip $HOST:
ssh -i "collector.pem" $HOST "unzip -o pkg.zip -d cryptrader"
