include ops/make/Env.mk
.SUFFIXES:

require = $(if $(value $(1)),,$(error $(1) not set))
