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

| App             | Description                                                      |
| --------------- | ---------------------------------------------------------------- |
| `mfe-champions` | Champion browser with detail pages and abilities viewer          |
| `mfe-tier-list` | Tier list rankings filterable by tier, role, and patch           |
| `mfe-player`    | Authenticated player profile — owned champions and match history |

## Shared Libraries

| Lib                | Description                                                             |
| ------------------ | ----------------------------------------------------------------------- |
| `libs/ui`          | StencilJS web components (`lol-*` prefix). Leaf node — no monorepo deps |
| `libs/domain`      | TypeScript types + Valibot schemas. No framework code                   |
| `libs/data-access` | React hooks + Hono fetch clients. Depends on `libs/domain`              |
| `libs/storybook`   | Storybook stories for `libs/ui` components                              |

## Tech Stack

[Vike](https://vike.dev/) · [React 19](https://react.dev/) · [StencilJS](https://stenciljs.com/) · [Tailwind CSS v4](https://tailwindcss.com/) · [shadcn/ui](https://ui.shadcn.com/) · [Hono](https://hono.dev/) · [Auth0](https://auth0.com/) · [Jotai](https://jotai.org/) · [Valibot](https://valibot.dev/) · [Vitest](https://vitest.dev/) · [Playwright](https://playwright.dev/) · [Storybook 10](https://storybook.js.org/) · [NX](https://nx.dev/) · [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) · [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) · TypeScript 6

## Getting Started

```bash
pnpm install

# Run an app in dev mode
pnpm nx run mfe-champions:dev
pnpm nx run mfe-tier-list:dev
pnpm nx run mfe-player:dev

# Build all
pnpm nx run-many -t build

# Test all
pnpm nx run-many -t test

# Lint all
pnpm nx run-many -t lint

# Visualize project graph
pnpm nx graph
```

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

Types and Valibot schemas live in `libs/domain/src/`.

## Contributing

See [AGENTS.md](./AGENTS.md) for architecture decisions, conventions, and AI agent instructions.
