#!/bin/sh
HOST="ubuntu@ec2-18-196-86-128.eu-central-1.compute.amazonaws.com"
ssh -i "collector.pem" -X $HOST
