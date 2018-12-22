GCLOUD_ZONE 		   ?= europe-north1-c
GCLOUD_PROJECT 		   ?= trader-223410

BUILD_TYPE ?= debug

HERE = $(realpath .)
CWD = $(HERE)

PROJECT_NAME ?= trader

DOCKER_REGISTRY_DOMAIN ?= docker.io
DOCKER_REGISTRY_PATH   ?= semtexzv
