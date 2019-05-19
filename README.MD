# System for algorithmic trading
This system was developed as a Masters thesis by Michal Hornický <xhorni14@stud.fit.vutbr.cz> while studying
at Brno University of Technology, IT-MGR-2 study plan.

## Deployed copy

The resulting application is deployed at [semtexzv.com]. This application requires registration, however, it currently
utilizes the provided email as an unique identifier. The password is stored in hashed form, with very complex hash function.

All accounts on this deployment are unlmited, and therefore it can be used for testing the running application.

## Building

If you wish to run your own copy of this application, you will have to satisfy a few requirements.

1. Tools for building Rust \& React applications installed on local machine, these are : `rustc, cargo, npm`.
2. Digital ocean command line tools : `doctl`
3. Kubernetes command line tools : `kubectl`
4. Docker installed
5. Digital ocean account
6. Docker hub account



Steps for creating and connecting all services necessary.
1. Create a new kubernetes cluster on digital ocean (here)[https://www.digitalocean.com/products/kubernetes/]
2. Login into digital ocean account using the `doctl` command line tool.
3. Select proper kubernetes cluster using the `doctl` tool.
4. Verify that you are properly logged in using the `kubectl get nodes` command.
5. Login to docker hub using `docker login`
6. Replace docker hub information inside the `ops/make/Env.mk` Makefile, namely the `DOCKER_REGISTRY_PATH`
with your docker hub account name.


Steps for deploying the application:
1. Build web application using following command: `cd code/web/app && npm install && npm build`
1. run `make deploy` in the main directory


