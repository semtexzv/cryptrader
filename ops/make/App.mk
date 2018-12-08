include ops/make/Macros.mk
# include dependencies generated by cargo
include $(wildcard ./target/debug/*.d)

$(call require,APP_NAME)
$(call require,DOCKER_REGISTRY_DOMAIN)
$(call require,DOCKER_REGISTRY_PATH)

DOCKER_IMAGE_VAR = $(shell echo "$(APP_NAME)_IMAGE" | tr '-' '_' | tr '[:lower:]' '[:upper:]')

CODE_FILES  = $(wildcard code/$(APP_NAME)/*) $(wildcard code/$(APP_NAME)/**/*)
APP_FILE    = target/debug/$(APP_NAME)
DOCKER_MARK = target/docker/$(APP_NAME)

# We use binary hash as unique identifier of a release of an application
VERSION = $(shell sha256sum $(APP_FILE) | cut -c1-9 )

DOCKER_IMAGE_PACKAGE    = $(PROJECT_NAME)-$(APP_NAME)
DOCKER_IMAGE            = $(DOCKER_REGISTRY_PATH)/$(DOCKER_IMAGE_PACKAGE):$(VERSION)
DOCKER_IMAGE_DOMAIN     = $(DOCKER_REGISTRY_DOMAIN)/$(DOCKER_IMAGE)

.PHONY: build
build: $(APP_FILE)

$(APP_FILE): $(realpath $(APP_FILE))
$(APP_FILE) $(realpath $(APP_FILE)): $(CODE_FILES)
	cargo build --package $(APP_NAME)

.PHONY: image
image: $(DOCKER_MARK)

target/docker:
	mkdir -p ./target/docker

$(DOCKER_MARK): $(APP_FILE) ops/docker/app.Dockerfile target/docker
	docker build -f ./ops/docker/app.Dockerfile -t $(DOCKER_IMAGE) --build-arg app_name=$(APP_NAME) .
	docker push $(DOCKER_IMAGE)
	mkdir -p ./target/docker
	echo "$(DOCKER_IMAGE_VAR)='$(DOCKER_IMAGE)'" > ./target/docker/$(APP_NAME)
