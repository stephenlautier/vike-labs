# @rift/api

Standalone Hono backend for the Rift workspace. SQLite via Drizzle.

## Dev

```bash
pnpm nx run api:db:push   # apply schema to ./data/rift.db
pnpm nx run api:db:seed   # load champions/players from libs/champion + libs/player
pnpm nx run api:dev       # http://localhost:3100
```

## Endpoints

- `GET /health`
- `GET /champions`
- `GET /champions/:id`
- `GET /tier-list?tier=&role=&patch=`
- `GET /player/me` *(auth required)*
- `GET /player/me/champions` *(auth required)*
- `GET /player/me/matches` *(auth required)*

Auth is verified via the shared `@rift/auth` package against the Auth.js
session cookie. The shell server (`apps/shell`) is the only one issuing
those cookies; the API just reads them.
