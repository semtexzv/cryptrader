include ops/make/Macros.mk

MAKEFLAGS += -j 4

APPS=app web

DOCKER_FILES=$(addprefix ./target/docker/, $(APPS))
APP_SOURCES=$(addprefix ./code/, $(APPS))

K8S_DIR       :=./ops/kube
K8S_BUILD_DIR ?=./target/kube
K8S_FILES 	  := $(shell find $(K8S_DIR) -name '*.yaml' | sed 's:$(K8S_DIR)/::g')

MAKE_ENV += DOCKER_IMAGE_PACKAGE VERSION DOCKER_IMAGE DOCKER_IMAGE_DOMAIN
SHELL_EXPORT = $(foreach v,$(MAKE_ENV),$(v)='$($(v))' )

LOAD_VARS = $(foreach v,$(DOCKER_FILES), env $$( cat $(v) ))

./target/docker/%: .PHONY
	APP_NAME=$* $(MAKE) -C . -f ./ops/make/App.mk ./target/docker/$*

$(K8S_BUILD_DIR):
	@mkdir -p $(K8S_BUILD_DIR)

.PHONY: build-k8s
build-k8s: $(K8S_BUILD_DIR) $(DOCKER_FILES)
	@for file in $(K8S_FILES); do \
		mkdir -p `dirname "$(K8S_BUILD_DIR)/$$file"` ; \
		$(LOAD_VARS) envsubst <$(K8S_DIR)/$$file >$(K8S_BUILD_DIR)/$$file ;\
	done

.PHONY: deploy
deploy: build-k8s $(DOCKER_FILES)
	kubectl apply -f $(K8S_BUILD_DIR)