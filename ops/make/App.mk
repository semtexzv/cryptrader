include ops/make/Macros.mk

APP_NAME ?= app

DOCKER_IMAGE_VAR = $(shell echo "$(APP_NAME)_IMAGE" | tr '-' '_' | tr '[:lower:]' '[:upper:]')

CODE_FILES = $(wildcard code/$(APP_NAME)/*) $(wildcard code/$(APP_NAME)/**/*)
APP_FILE   = target/debug/$(APP_NAME)

# If debug is set, we create unique id and force push
VERSION = $(shell sha256sum $(APP_FILE) | cut -c1-9 )

DOCKER_IMAGE_PACKAGE   = trader-$(APP_NAME)
DOCKER_REGISTRY_DOMAIN ?= docker.io
DOCKER_REGISTRY_PATH   ?= semtexzv
DOCKER_IMAGE           = $(DOCKER_REGISTRY_PATH)/$(DOCKER_IMAGE_PACKAGE):$(VERSION)
DOCKER_IMAGE_DOMAIN    = $(DOCKER_REGISTRY_DOMAIN)/$(DOCKER_IMAGE)

K8S_DIR       :=./ops/kube
K8S_BUILD_DIR ?=./target/kube
K8S_FILES 	  := $(shell find $(K8S_DIR) -name '*.yaml' | sed 's:$(K8S_DIR)/::g')

MAKE_ENV += DOCKER_IMAGE_PACKAGE VERSION DOCKER_IMAGE DOCKER_IMAGE_DOMAIN
SHELL_EXPORT := $(foreach v,$(MAKE_ENV),$(v)='$($(v))' )

.PHONY: build
build: $(APP_FILE)

$(APP_FILE): $(CODE_FILES)
	cargo build --package $(APP_NAME)

.PHONY: image
image: target/docker/$(APP_NAME)

target/docker/$(APP_NAME) : $(APP_FILE) ops/docker/app.Dockerfile
	docker build -f ./ops/docker/app.Dockerfile -t $(DOCKER_IMAGE) --build-arg app_name=$(APP_NAME) .
	docker push $(DOCKER_IMAGE)
	mkdir -p ./target/docker
	echo "$(DOCKER_IMAGE_VAR)='$(DOCKER_IMAGE)'" > ./target/docker/$(APP_NAME)
