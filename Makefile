export BUILD_TYPE=debug

include ops/make/Macros.mk

MAKEFLAGS += -j 4

APPS=bitfinex app web

DOCKER_FILES  = $(addprefix ./target/docker/, $(APPS))
APP_SOURCES   = $(addprefix ./code/, $(APPS))

K8S_DIR       := ./ops/k8s
K8S_BUILD_DIR := ./target/k8s
K8S_FILES 	  := $(shell find $(K8S_DIR) -name '*.yaml' | sed 's:$(K8S_DIR)/::g')

LOAD_VARS = $(foreach v,$(DOCKER_FILES) ./ops/additional.env, env $$( cat $(v) ))

.PHONY: deploy
deploy: build-k8s $(DOCKER_FILES)
	kubectl apply -f $(K8S_BUILD_DIR)

./target/docker/%: .PHONY
	APP_NAME=$* $(MAKE) -C . -f ./code/$*/Makefile ./target/docker/$*


$(K8S_BUILD_DIR):
	@mkdir -p $(K8S_BUILD_DIR)

.PHONY: build-k8s
build-k8s: $(K8S_BUILD_DIR) $(DOCKER_FILES)
	@for file in $(K8S_FILES); do \
		mkdir -p `dirname "$(K8S_BUILD_DIR)/$$file"` ; \
		$(LOAD_VARS) VERSION= envsubst <$(K8S_DIR)/$$file >$(K8S_BUILD_DIR)/$$file ;\
	done