# WEXON API (Backend) — Project Context

Last updated: 2026-03-14

## What this is

`wexon-api/` is a Spring Boot backend API for WEXON. It exposes REST endpoints under `/api/v1/**` and persists data to MongoDB.

## Tech stack

- Java 21
- Spring Boot (Gradle plugin present; project uses typical Spring starters)
- Spring Web (REST)
- Spring Security (JWT auth)
- MongoDB (Spring Data MongoDB)
- Mongock (MongoDB migrations)
- OpenAPI/Swagger UI (`springdoc-openapi`)
- Twilio SDK (SMS)
- Actuator enabled (actuator endpoints permitted by security config)

## Local ports and base paths

- API server port: `8083` (see `wexon-api/src/main/resources/application.yaml`)
- Primary API prefix: `/api/v1`
- Swagger/OpenAPI:
  - Swagger UI: `/swagger-ui/**`
  - OpenAPI JSON: `/v3/api-docs/**`

## Authentication model (high level)

- Requests are authenticated via `Authorization: Bearer <jwt>` for non-public routes.
- Security allowlist (no auth required) is configured in:
  - `wexon-api/src/main/java/com/wexon/software/wexon_api/configurations/SecurityConfig.java`
  - `wexon-api/src/main/java/com/wexon/software/wexon_api/modules/auth/components/JwtAuthFilter.java`
- The UI calls:
  - `POST /api/v1/auth/login`
  - `GET /api/v1/user/getCurrentUser`

## Major modules and routes

Controllers live under `wexon-api/src/main/java/com/wexon/software/wexon_api/modules/**`.

Common prefixes you’ll see:

- Auth: `/api/v1/auth/**`
- Users/Roles: `/api/v1/user/**`, `/api/v1/roles/**`
- Warehouse: `/api/v1/warehouse/**`
- Products: `/api/v1/product/**`
- Vendors: `/api/v1/vendor/**`
- Inventory:
  - Transactions: `/api/v1/inventory/transactions/**`
  - Transaction details: `/api/v1/inventory/transactions/details/**`
  - Batch inventory: `/api/v1/inventory/batch-inventory/**`
  - Product inventory: `/api/v1/product/inventory/**`
- Ledger:
  - Accounts: `/api/v1/ledger/account/**`
  - Transactions: `/api/v1/ledger/transaction/**`
- Notifications (SMS): `/api/v1/notification/sms/**`
- Farmers: `/api/v1/farmer/**`

## Response envelope

Most endpoints return an envelope shaped like:

```json
{ "message": "...", "data": { } }
```

This is implemented via `ApiResponse`/`ApiResult` in `wexon-api/src/main/java/com/wexon/software/wexon_api/commons/responses/**`.

## Configuration and environment

Main config file:

- `wexon-api/src/main/resources/application.yaml`

Key settings currently present there:

- `server.port: 8083`
- MongoDB URI (currently set to a localhost URI)
- Mongock enabled + migration scan package
- Twilio settings

Note: there are Docker Compose files that set `SPRING_PROFILES_ACTIVE` to `local`/`prod`, but there are no `application-local.yaml` / `application-prod.yaml` files in the repo currently. If you rely on profiles, add those files or ensure all profile-specific values are provided via environment variables.

## Running the backend

From `wexon-api/`:

- Run (dev): `./gradlew bootRun`
- Build jar: `./gradlew bootJar`
  - Output jar: `build/libs/wexon-api.jar` (see `bootJar.archiveFileName`)

You’ll need MongoDB reachable at whatever URI Spring is configured to use.

## Docker setups

There are two compose setups:

- Local dev: `wexon-api/docker/local/docker-compose.yml`
  - Starts `wexon-api` (via `./gradlew bootRun`) + `mongo`
- Production-ish: `wexon-api/docker/production/docker-compose.yml`
  - Uses `jwilder/nginx-proxy` + Let’s Encrypt companion
  - Builds `wexon-api` image using `wexon-api/Dockerfile`
  - Also runs `mongo-express`

## Important implementation notes / gotchas

- The JWT signing key is currently hard-coded in `JwtProvider` (`wexon-api/src/main/java/com/wexon/software/wexon_api/modules/auth/components/JwtProvider.java`). Consider moving secrets (JWT key, Twilio creds, etc.) to environment variables and removing them from git history.
- Local Docker Compose uses a separate MongoDB container. If the app is configured with a `mongodb://localhost:...` URI inside the container, it won’t reach that MongoDB container; use the compose service name (e.g. `mongodb://wexon-db:27017/...`) via profile/env overrides.

## Related docs

- System overview: `README.md` (repo root)

