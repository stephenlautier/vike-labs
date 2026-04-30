# rift

> Experiment and testing monorepo for exploring [Vike](https://vike.dev/), micro-frontends (MFE), SSR/hydration strategies, and [StencilJS](https://stenciljs.com/) web components.

Domain theme: **League of Legends** — champions, abilities, tier lists, skins, and player profiles.

## What's being explored

| Topic                       | How                                                   |
| --------------------------- | ----------------------------------------------------- |
| SSR & selective hydration   | Vike `+config.ts` per-page SSR toggles                |
| Micro-frontends             | 3 independent Vike apps sharing `libs/`               |
| Web components in React SSR | StencilJS `lol-*` components with React output target |
| Atomic state management     | Jotai atoms co-located with features                  |
| URL-synced filter state     | Tier list filters persisted in search params          |

## Apps

| App             | Port    | Auth                | Description                                                |
| --------------- | ------- | ------------------- | ---------------------------------------------------------- |
| `shell`         | `:3000` | —                   | Host shell — global nav, home page                         |
| `mfe-champions` | `:3001` | Public              | Champion browser with detail pages and abilities viewer    |
| `mfe-tier-list` | `:3002` | Public              | Tier list rankings filterable by tier, role, and patch     |
| `mfe-player`    | `:3003` | Mocked demo session | Player profile — owned champions and match history         |
| `api`           | `:3100` | Mocked demo session | Hono backend (SQLite via Drizzle) — serves all domain data |

> **Auth note**: Auth0/Auth.js is currently disabled. The API injects a mock session for the seeded demo player (`auth0|rift-demo`) so guarded `/player/*` routes work without a login flow.

## Shared Libraries

| Lib                | Description                                                               |
| ------------------ | ------------------------------------------------------------------------- |
| `libs/ui`          | StencilJS web components (`lol-*` prefix). Leaf node — no monorepo deps   |
| `libs/champion`    | TypeScript types + Valibot schemas for champion domain. No framework code |
| `libs/player`      | TypeScript types + Valibot schemas for player domain. Depends on champion |
| `libs/data-access` | React hooks + Hono fetch clients. Depends on champion + player libs       |
| `libs/storybook`   | Storybook stories for `libs/ui` components                                |

## Tech Stack

[Vike](https://vike.dev/) · [React 19](https://react.dev/) · [StencilJS](https://stenciljs.com/) · [Tailwind CSS v4](https://tailwindcss.com/) · [shadcn/ui](https://ui.shadcn.com/) · [Hono](https://hono.dev/) · [Drizzle ORM](https://orm.drizzle.team/) + SQLite · [Jotai](https://jotai.org/) · [Valibot](https://valibot.dev/) · [Vitest](https://vitest.dev/) · [Playwright](https://playwright.dev/) · [Storybook 10](https://storybook.js.org/) · [NX](https://nx.dev/) · [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) · [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) · TypeScript 6

---

## Getting Started

### Prerequisites

- Node.js ≥ 24.14
- pnpm ≥ 9

```bash
pnpm install
```

### Seed the database

The API uses SQLite (file at `apps/api/data/rift.db`) and ships with seed data
for champions, abilities, skins, tier entries, and a single demo player with
match history. **Run this once before starting dev**:

```bash
pnpm nx run api:db:push   # create / migrate the SQLite schema
pnpm nx run api:db:seed   # populate champions, tiers, demo player + matches
```

Re-run `api:db:seed` any time you change the seed sources in
`libs/champion/src/seed.ts` or `apps/api/src/db/seed.ts` — it clears and
repopulates all tables.

### Running apps in dev mode

Start all apps concurrently (each on its own port):

```bash
pnpm dev
```

Or start individual apps:

```bash
pnpm dev:shell        # http://localhost:3000
pnpm dev:champions    # http://localhost:3001
pnpm dev:tier-list    # http://localhost:3002
pnpm dev:player       # http://localhost:3003
```

The API runs separately:

```bash
pnpm nx run api:dev       # http://localhost:3100
```

Via NX directly:

```bash
pnpm nx run shell:dev
pnpm nx run mfe-champions:dev
pnpm nx run mfe-tier-list:dev
pnpm nx run mfe-player:dev
```

### Storybook (UI component explorer)

Storybook browses the `libs/ui` StencilJS web components. The `libs/ui` build must run first since Storybook reads the compiled output.

```bash
# Build libs/ui first (required once, then only on component changes)
pnpm nx run ui:build

# Start Storybook
pnpm storybook
# → http://localhost:6006
```

### Build, test, lint

```bash
pnpm build               # build all projects (respects NX dependency order)
pnpm test                # run all unit tests
pnpm lint                # lint all projects
pnpm fmt                 # format all files
pnpm fmt:check           # check formatting (used in CI)

pnpm nx graph            # open interactive project dependency graph
pnpm nx:reset            # clear NX cache (use when builds behave unexpectedly)
```

---

## Authentication

Auth0/Auth.js is **disabled** in this experiment. The API middleware
([apps/api/src/middleware/auth.ts](apps/api/src/middleware/auth.ts))
injects a mock session for the seeded demo player on every request, so
`/player/*` routes resolve to that player without any login flow.

To re-enable Auth0 later: restore `getSession`/`requireUser` from
`@rift/auth`, add the dependency back to [apps/api/package.json](apps/api/package.json),
and provide `AUTH0_*` + `AUTH_SECRET` env vars to whichever app issues the
Auth.js cookie.

---

## Domain Model

| Entity             | Key Fields                                                                           |
| ------------------ | ------------------------------------------------------------------------------------ |
| `Champion`         | id, name, roles, difficulty (1–10), stats, splashArtUrl, lore                        |
| `ChampionAbility`  | id, slot (Q/W/E/R/P), name, description, cooldown, championId                        |
| `ChampionTier`     | id, championId, tier (S/A/B/C/D), role, patch, winRate, pickRate                     |
| `ChampionSkin`     | id, championId, name, rpPrice, splashArtUrl, rarity                                  |
| `Player`           | id, summonerName, accountId, profileIconId, summonerLevel, auth0Sub                  |
| `PlayerChampion`   | playerId, championId, masteryLevel, masteryPoints, owned                             |
| `PlayerMatchEntry` | id, playerId, championId, role, kills, deaths, assists, win, gameDuration, matchDate |

Types and Valibot schemas live in `libs/champion/src/` and `libs/player/src/`.

## Contributing

See [AGENTS.md](./AGENTS.md) for architecture decisions, conventions, and AI agent instructions.
