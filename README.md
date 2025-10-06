# Blusalt Drone Dispatch Service

A NestJS service for registering delivery drones, loading them with medication payloads, tracking dispatch jobs, and auditing fleet battery health. The project uses an in-memory MongoDB replica set (mongodb-memory-server) so it can run locally without additional infrastructure.

## Repository

```
https://github.com/itonyeig/blusalt-drone-dispatch-service
```

## Features

- Register drones with configurable models, capacity, and battery levels
- Load drones with medication items while enforcing weight and battery guardrails
- Track dispatch jobs through their state transitions (IDLE ? LOADING ? � ? IDLE)
- Automatic battery drain after each completed delivery
- Paginated views for drones and per-drone battery audit trails
- Cron job that snapshots every drone's battery level every 10 minutes (Africa/Lagos)
- Built-in Swagger UI for exploring and testing the REST API
- Seed data (10 drones, 3 medications) loaded at startup for quick experimentation

## Requirements

- Node.js 18+
- npm 9+

Everything else (MongoDB) runs in-memory via `mongodb-memory-server`.

## Getting Started

```bash
# 1. Clone the repository
$ git clone https://github.com/itonyeig/blusalt-drone-dispatch-service.git
$ cd blusalt-drone-dispatch-service

# 2. Install dependencies
$ npm install

# 3. Start the app (watch mode)
$ npm run start:dev
```

The service listens on **http://localhost:4000** by default. Each restart launches a fresh in-memory Mongo replica set, runs database migrations, and seeds demo data. When the application terminates, the in-memory database is gracefully disposed, ensuring a clean slate for the next run.

> **Swagger UI**: After the server boots, open [http://localhost:4000/docs](http://localhost:4000/docs) to inspect the API schema, try requests, and view example payloads.

## Available Scripts

```bash
# Development server (watch mode)
npm run start:dev

# Single-run development server
npm run start

# Production build & start
npm run build
npm run start:prod
```

### Cron & Background Tasks

- A scheduled job runs every 1 hour to snapshot drone battery levels into the `AuditBattery` collection.
- Battery snapshots can be retrieved via `GET /drone/:droneId/audit` with pagination and optional ISO date filters (`startDate`, `endDate`).

## Data Seeding

On every startup the seed service provisionally upserts:

- 10 drones spanning all models and states
- 3 medications (weight = 20g) with sample images

Feel free to edit `src/seed/seed.service.ts` if you want to adjust the initial dataset.

## Testing In Swagger

1. Launch the dev server (`npm run start:dev`).
2. Navigate to [http://localhost:4000/docs](http://localhost:4000/docs).
3. Expand the `Drone` or `Dispatch` tags to exercise endpoints:
   - `POST /drone` to register new drones
   - `GET /drone` or `GET /drone/{droneId}/audit` for paginated listings
   - `POST /dispatch/{droneId}/load` to simulate a delivery with automatic state transitions
4. Update request bodies directly in the Swagger UI; responses include normalized JSON using the shared response formatter.

## Notes

- Transactions are enabled by running `mongodb-memory-server` in replica set mode. No external database is required.
- Guards and service-level checks prevent overweight loads or low-battery dispatch attempts (<25%).
- The cron job and seed module are registered automatically�no extra configuration needed.


