# Milestone 3 — SmartRetail Supplier Sync (Repo)

This repository contains a Dockerized demo of an event-driven inventory sync:
- Backend (Express) that emits stock events to an Azure Storage Queue (Azurite)
- Azure Function (Queue Trigger) that consumes the message and posts to Supplier API
- Supplier API (Express) that simulates a supplier and returns a confirmation
- Two docker-compose options:
  - `docker-compose.dockerized.yml` — everything runs in Docker (Azurite + backend + supplier + functions host)
  - `docker-compose.hybrid.yml` — backend & supplier run in Docker; run Azure Functions on host using Azure Functions Core Tools

See `demo.sh` for demo commands and `.env.example` for environment variables.
