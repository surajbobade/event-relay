# Event Relay

Reliable event delivery, without the pain. Send events over a simple API,
Event Relay matches them to registered webhooks and delivers them with
automatic retries — with a live dashboard to watch everything in flight.

## Monorepo layout

This repo holds three independent projects (no shared package manager
workspace — each has its own `node_modules` and lockfile):

| Folder | What it is | Stack |
|---|---|---|
| [`server/`](server) | REST + WebSocket API: webhook management, event ingestion/delivery, auth, teams & permissions | NestJS, MongoDB (Mongoose), Redis, BullMQ, Socket.IO |
| [`client/`](client) | The main app — dashboard, webhooks, events, API keys, team management | React, Vite, TypeScript, Tailwind CSS, Zustand |
| [`landing/`](landing) | Public marketing site | React, Vite, TypeScript, Tailwind CSS |

## Features

- **Webhook management** — register endpoint URLs, subscribe them to
  specific event types, and toggle them on or off.
- **Event ingestion** — send events in with a scoped API key; each event
  fans out to every matching, active webhook.
- **Automatic retries** — failed deliveries retry with exponential
  backoff, up to 5 attempts, before being marked as failed.
- **Live delivery tracking** — events and delivery attempts stream to the
  dashboard in real time over WebSockets.
- **Teams & permissions** — invite teammates as Admins or Members, and
  grant granular per-resource permissions (view vs. manage) per section
  (Webhooks, API Keys, Events).

## Prerequisites

- Node.js 20+
- MongoDB running locally (or a connection string to one)
- Redis running locally (or a connection string to one) — used for BullMQ
  job queues and OTP/session state

## Getting started

Each project is run independently.

### 1. Server (API)

```bash
cd server
npm install
npm run start:dev      # http://localhost:3000
```

Create a `server/.env` with the following variables:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_ACCESS_SECRET` / `JWT_EXPIRES_IN` | Signing secret & TTL for access tokens |
| `JWT_REFRESH_SECRET` / `JWT_REFRESH_EXPIRES_IN` | Signing secret & TTL for refresh tokens |
| `PORT` | API port (defaults to `3000`) |

### 2. Client (main app)

```bash
cd client
npm install
npm run dev             # http://localhost:5173
```

Configure `client/.env`:

| Variable | Description |
|---|---|
| `VITE_SERVER_URL` | Base URL of the running server (e.g. `http://localhost:3000`) |

In dev, API calls are proxied through Vite (see `client/vite.config.ts`) so
the browser sees same-origin requests, which keeps the refresh-token
cookie same-site.

### 3. Landing page

```bash
cd landing
npm install
npm run dev              # http://localhost:5174 (or next free port)
```

## API overview

- `POST /events` — ingest an event (authenticated with an API key via
  `Authorization: Bearer <key>`), body: `{ event: string, payload?: object }`
- `GET /events`, `GET /events/stats` — list events / today's stats
  (JWT-authenticated, requires the `events:view` permission)
- `POST /webhooks`, `GET /webhooks`, `PATCH /webhooks/:id`,
  `DELETE /webhooks/:id` — manage webhook endpoints (requires
  `webhooks:view` / `webhooks:manage`)
- `POST /api-keys`, `GET /api-keys`, `DELETE /api-keys/:id` — manage API
  keys (requires `api_keys:view` / `api_keys:manage`)
- `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`,
  `POST /auth/logout`, `GET /auth/me` — authentication
- `POST /users`, `GET /users`, `PATCH /users/:id/permissions` — team
  member management (admin only)
- `GET /businesses/me`, `PATCH /businesses/me` — the current business

## Contributing

Each project has its own lint/test scripts — run them from within that
project's folder:

```bash
npm run lint
npm test        # server only
```
