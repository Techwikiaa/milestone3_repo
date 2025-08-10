#!/usr/bin/env bash
set -e
echo "Two compose options available:
1) dockerized (everything in docker)
   docker-compose -f docker-compose.dockerized.yml up --build
2) hybrid (run function host locally)
   docker-compose -f docker-compose.hybrid.yml up --build

# Example emit command (after services are up):
# curl -X POST http://localhost:3000/emit -H 'Content-Type: application/json' -d '{"productId":"P-1001","qty":2}'

# Hybrid: to run Function locally, install Azure Functions Core Tools and run:
# cd function
# npm install
# func start

