#!/bin/bash

docker run -d --name cryptrader-db -v /pg/cryptrader:/var/lib/postgresql/data -p 5433:5432 timescale/timescaledb:0.8.0-pg10