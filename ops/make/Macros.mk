include ops/make/Env.mk
.SUFFIXES:

MAKEFLAGS += --no-builtin-rules
MAKEFLAGS += --no-builtin-variables

.PHONY: phony
require = $(if $(value $(1)),,$(error $(1) not set))

