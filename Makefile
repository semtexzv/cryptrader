NIX_FILES=$(wildcard ops/nix/*)
CODE_FILES=$(wildcard code/**/*)

.PHONY: image-builder app image-app deploy

images/%.tgz: $(NIX_FILES) ops/scripts/build-image.sh
	./ops/scripts/build-image.sh $*

image-builder: $(NIX_FILES) ops/scripts/build-image.sh
	./ops/scripts/build-image.sh builder

app: $(CODE_FILES)
	#./ops/scripts/build-app.sh
	cargo build --package dp

image-app: app
	docker build -f ./ops/docker/app.Dockerfile -t semtexzv/app:latest .

deploy-config:
	kubectl apply -f ./ops/kube/
    
deploy: image-app
	$(eval HASH=$(shell docker push semtexzv/app:latest | grep digest | awk '{split("$0", a, "[: ]"); print a[6]; }' -))
	kubectl set image deployment --all app=semtexzv/app@sha256:$(HASH)
