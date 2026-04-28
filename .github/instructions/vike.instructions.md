---
applyTo: "apps/**"
description: Vike filesystem routing and data-fetching patterns for this monorepo
---

# Vike Conventions

## File-Based Routing

Each page is a directory under `pages/` with `+Page.tsx`:

```
pages/
  index/
    +Page.tsx          # route: /
    +data.ts           # data fetching
    +title.ts          # <title> tag
  champions/
    +Page.tsx          # route: /champions
    +data.ts
    @id/
      +Page.tsx        # route: /champions/:id
      +data.ts
      +route.ts        # optional custom route
  tier-list/
    +Page.tsx          # route: /tier-list
    +data.ts
  +Layout.tsx          # root layout (wraps all pages)
  +config.ts           # root config (extends vike-react)
```

## Config (`+config.ts`)

Always extend `vike-react` in the root config:

```ts
// pages/+config.ts
import vikeReact from "vike-react/config";
export default {
	extends: [vikeReact],
	ssr: true,
};
```

Per-page overrides (e.g. disable SSR for a page):

```ts
// pages/some-spa-page/+config.ts
export default { ssr: false };
```

## Data Fetching (`+data.ts`)

```ts
// pages/champions/@id/+data.ts
import type { PageContextServer } from "vike/types";
import { getChampion } from "../../../libs/data-access/src";

export async function data(pageContext: PageContextServer) {
	const { id } = pageContext.routeParams;
	return getChampion(id); // return value becomes `pageContext.data`
}
export type Data = Awaited<ReturnType<typeof data>>;
```

Consume with `useData()` in the component:

```tsx
import { useData } from "vike-react/useData";
import type { Data } from "./+data";

export default function Page() {
	const champion = useData<Data>();
	return <lol-champion-card champion={champion} />;
}
```

## Head Tags (`+Head.tsx`)

```tsx
// pages/champions/@id/+Head.tsx
import { useData } from "vike-react/useData";
import type { Data } from "./+data";

export default function Head() {
	const { name } = useData<Data>();
	return <title>{name} — LoL Champions</title>;
}
```

## API Routes via Hono (`+server.ts`)

Hono server handler lives alongside pages or in a dedicated `server/` dir:

```ts
// server/index.ts
import { Hono } from "hono";
import { championsRouter } from "./routers/champions";

const app = new Hono();
app.route("/api/champions", championsRouter);
export default app;
```

## Guards (auth protection)

```ts
// pages/protected/+guard.ts
import type { PageContextServer } from "vike/types";
import { render } from "vike/abort";

export async function guard(pageContext: PageContextServer) {
	if (!pageContext.user) throw render(401);
}
```

## Common Pitfalls

- `+data.ts` runs **server-side only** — never import browser APIs there
- Use `.server.ts` suffix for files that must never be bundled for the client
- Layouts at `pages/+Layout.tsx` wrap ALL pages — use nested `+Layout.tsx` for sub-trees
- `pageContext.data` is serialized to JSON — keep it plain; no class instances
