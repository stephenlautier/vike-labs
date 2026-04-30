# rift — MFE Architecture Rework Plan

> Status: **Proposal / RFC**. Supersedes the original `setup-plan.md` Phase 2.
> Goal: rework the current "N independent Vike apps with their own servers and
> hardcoded `<a href>` cross-app links" into a true micro-frontend architecture
> with **one shell server**, **shared bundles for horizontal MFEs**, **SSR +
> hydration end-to-end**, and **one vertical MFE on a different stack** as a
> showcase.

---

## 1. Goals & Non-Goals

### Goals

1. **One server.** Only `apps/shell` runs a Node/Hono process. Per-MFE
   `+server.ts` / `server/hono.ts` files are removed; per-MFE Hono routers are
   imported and mounted by the shell.
2. **Consistent header/auth in shell.** Header, nav, Auth.js session, and the
   `user` object are owned by the shell and exposed to MFEs via `pageContext`
   (SSR) and a small client-side context API (CSR).
3. **SSR + hydration** for every MFE (horizontal and vertical).
4. **Horizontal MFEs (`mfe-champions`, `mfe-tier-list`)**: same stack
   (Vite + React 19 + vike-react), share React/vike/jotai/`@rift/*` chunks,
   navigate between each other and shell **without full reload**.
5. **Vertical MFE (`mfe-player`)**: different stack (StencilJS + custom
   element). Full-page reload across the vertical boundary is acceptable.
6. **Routes own themselves.** Each horizontal MFE owns its sub-routes; shell
   only declares the namespace entry (`/champions/*`, `/tier-list/*`,
   `/player/*`).
7. **Independently deployable.** Each MFE produces its own remote bundle (and
   for horizontal MFEs, its own Hono router package) that can be republished
   without rebuilding the shell.
8. **Performance first**: shared chunks, link prefetch, streamed HTML, no
   double-shipping of React.

### Non-Goals

- Multi-region deployment / edge runtimes (out of scope for this plan).
- A custom MFE registry — we'll use static URLs / env-driven manifests.
- Replacing Vike. The shell stays Vike-first.
- Replacing Auth.js or Auth0.

---

## 2. Library Evaluation

### `@module-federation/vite` (recommended)

- Active (1.15.x, Nov 2025), official Vite plugin from the Module Federation
  team, used in production by Vue/React/Nuxt/TanStack examples.
- Supports **shared singletons** (React, vike-react, jotai, `@rift/*`) so a
  remote does not re-bundle the host's React.
- Has explicit SSR support (recent fixes: "fix up SSR flow" PR #452) — remotes
  can be loaded server-side via the federation runtime.
- Plays well with Vite's dev server (hot-reload across host+remote).
- Native API is minimal: a single `federation({ name, exposes, remotes,
  shared })` plugin per app.
- Integrates cleanly with `vike` plugin (both are vite plugins).

### OpenComponents

- Mature, battle-tested (OpenTable / Skyscanner). Registry + HTTP composition
  model: components are deployed to a server that returns rendered HTML +
  hydration JS.
- Strong fit for very large orgs with many independent teams using mixed
  stacks, because it's transport-agnostic (any framework, any backend).
- **Poor fit here** because:
  - Requires running and maintaining a registry (extra ops, conflicts with the
    "one server" goal).
  - SSR is HTTP-call-per-component, which adds latency per request.
  - Sharing a React/Vike runtime across components is not a first-class
    concern — every component tends to ship its own runtime.
  - Less Vite-native; would force us to leave the Vite/Vike dev DX.
- **Verdict:** keep on the radar for the Stencil vertical (it's actually a
  good fit for "drop a component anywhere on any page"), but **don't adopt
  for the React horizontal MFEs**.

### Other considered options

- **Native ESM + import maps** — too low-level, no shared-deps story.
- **`vite-plugin-federation` (originalcopy)** — unmaintained, superseded by
  `@module-federation/vite`.
- **Single-spa** — adds another orchestration layer on top of MF without
  giving us much we don't already get from Vike + MF.

### Decision

| Concern               | Pick                                                             |
| --------------------- | ---------------------------------------------------------------- |
| Horizontal MFE bundle | **`@module-federation/vite`** with `shared: { singleton: true }` |
| Vertical MFE delivery | **Stencil `dist-custom-elements` bundle**, loaded via `<script>` |
| Server                | **Hono** in shell, mounting per-MFE routers as packages          |
| Cross-MFE auth        | **Auth.js in shell**, `passToClient: ["user"]` via Vike          |
| Cross-MFE navigation  | **Vike Client Routing** + MF-loaded remote pages                 |

---

## 3. Target Architecture

```
                           ┌──────────────────────────────────────────┐
                           │                apps/shell                 │
                           │  Hono server (the only Node process)      │
                           │  ┌──────────────────────────────────────┐ │
                           │  │ Auth.js (/api/auth/**)               │ │
                           │  │ championsRouter   (/api/champions/*) │ │
                           │  │ tierListRouter    (/api/tier-list/*) │ │
                           │  │ playerRouter      (/api/player/*)    │ │
                           │  │ Vike middleware   (catch-all)        │ │
                           │  └──────────────────────────────────────┘ │
                           │                                            │
                           │  Vike pages (filesystem):                  │
                           │    pages/index/+Page.tsx   (home)          │
                           │    pages/champions/+route.ts → MF remote   │
                           │    pages/tier-list/+route.ts → MF remote   │
                           │    pages/player/+route.ts    → vertical    │
                           │    pages/+Layout.tsx  (header, auth UI)    │
                           └──────────────────────────────────────────┘
                                           │
            ┌──────────────────────────────┼─────────────────────────────┐
            │                              │                             │
   Module Federation             Module Federation              Custom-element bundle
   (shared React, vike-react)    (shared React, vike-react)     (Stencil, no React)
            │                              │                             │
   ┌────────▼────────┐            ┌────────▼────────┐           ┌────────▼────────┐
   │ mfe-champions   │            │ mfe-tier-list   │           │   mfe-player    │
   │ (horizontal)    │            │ (horizontal)    │           │   (vertical)    │
   │                 │            │                 │           │                 │
   │ exposes:        │            │ exposes:        │           │ ships:          │
   │  ./routes       │            │  ./routes       │           │  rift-player.js │
   │  ./api (Hono)   │            │  ./api (Hono)   │           │  rift-player.css│
   │  ./Pages/*      │            │  ./Pages/*      │           │                 │
   │                 │            │                 │           │ exports Hono    │
   │ no server.      │            │ no server.      │           │ router via npm  │
   └─────────────────┘            └─────────────────┘           └─────────────────┘
```

### What "horizontal" means here

- Same runtime: React 19 + vike-react + jotai.
- Built with `@module-federation/vite` as **remotes**.
- Pages and `+data` loaders are exposed as remote modules.
- Router stays Vike (one router across the whole app); page modules are loaded
  on demand via MF.
- Bundle savings: React, react-dom, vike, vike-react, jotai, `@rift/champion`,
  `@rift/player`, `@rift/data-access`, `@rift/ui` (the React wrappers) are all
  declared as `shared: { singleton: true }`. They live in the shell bundle and
  the remotes import them at runtime.

### What "vertical" means here

- Different stack: StencilJS web component, no React.
- Built once into a self-contained bundle (`rift-player.js`) that defines
  `<rift-player-app>` and includes its own internal client router.
- Shell `pages/player/+route.ts` is a Vike route that matches `/player/*` and
  renders a thin React component which:
  1. Loads the script (`<script type="module">` injected into `<head>`) on
     server during SSR (via the `+Head` hook) so HTML ships ready.
  2. Renders `<rift-player-app current-path={...} user={...}>`.
  3. Listens for the element's `routechange` custom event and calls
     `navigate()` to keep the URL in sync with Vike.
- SSR: the Stencil app is pre-rendered to HTML using
  `@stencil/core/internal/testing` server-side render or via the `www` output
  target. Hydration happens via Stencil's built-in
  `@stencil/core/internal/client` hydration runtime. (Acceptable trade-off:
  initial transition into `/player/*` may be a full reload — explicitly
  allowed by the requirements.)

---

## 4. Server Architecture (single-server)

### Today
- 4 separate `+server.ts` files, 4 Hono apps, 4 ports (3000/3001/3002/3003).
- `mfe-player` and `shell` both define their own Auth.js setup (duplication).

### Target

A single `apps/shell/server/hono.ts`:

```ts
const app = new Hono();

// auth always first
vike(app, [
  authjsSessionMiddleware,
  authjsHandler,
  championsRouter,    // from @rift/mfe-champions/server
  tierListRouter,     // from @rift/mfe-tier-list/server
  playerRouter,       // from @rift/mfe-player/server
]);
```

To make this work, each MFE package exposes a server entrypoint:

```jsonc
// apps/mfe-champions/package.json
"exports": {
  ".":         "./src/exposes/index.ts",   // MF remote entry (UI)
  "./server":  "./server/router.ts"        // Hono router (mounted by shell)
}
```

`apps/mfe-champions/server/router.ts`:

```ts
import { Hono } from "hono";
export const championsRouter = new Hono()
  .basePath("/api/champions")
  .get("/", c => c.json(SEED_CHAMPIONS))
  .get("/:id", c => { /* … */ });
```

Each MFE keeps its API code, but ownership of the **process** moves to shell.

### Auth flow

- Shell's session middleware sets `pageContext.session` and `pageContext.user`
  for **all** Vike pages (own and remote).
- `passToClient: ["user"]` ships a sanitized user object to the browser.
- `useUser()` hook in `libs/data-access` reads it from `pageContext` (works in
  every horizontal MFE because they share the same React context via MF).
- Vertical MFE (Stencil): user is passed in as a JSON-serialized prop on the
  custom element. Element exposes a `signOut` event.
- Per-MFE `+guard.ts` continues to work (e.g. `mfe-player` requires
  `pageContext.user`); shell's middleware populates the value, the guard
  enforces it.

---

## 5. Routing Strategy

### Shell-owned routes (filesystem)

```
apps/shell/pages/
  +Layout.tsx            ← header, auth UI, <Link prefetch> nav
  +config.ts             ← passToClient: ["user"], extends [vikeReact]
  index/+Page.tsx        ← home
  _error/+Page.tsx       ← 404 / error
  champions/+route.ts    ← claims /champions/*  (delegates to remote)
  champions/+Page.tsx    ← thin wrapper that lazy-loads remote
  champions/+data.ts     ← thin wrapper that calls remote's loader
  tier-list/+route.ts    ← claims /tier-list/*  (delegates to remote)
  tier-list/+Page.tsx
  tier-list/+data.ts
  player/+route.ts       ← claims /player/*     (renders Stencil host)
  player/+Page.tsx       ← mounts <rift-player-app>
```

### Remote routing (horizontal MFE)

Each horizontal MFE exposes a small **route table** instead of trying to
emulate filesystem routing across the federation boundary:

```ts
// apps/mfe-champions/src/exposes/routes.ts
export const routes = [
  { match: "/",        Page: ChampionsList,  data: listData },
  { match: "/:id",     Page: ChampionDetail, data: detailData },
] as const;
```

Shell's `pages/champions/+route.ts`:

```ts
import { routes } from "remote-champions/routes"; // MF remote import

export default async (pageContext) => {
  const sub = pageContext.urlPathname.replace(/^\/champions/, "") || "/";
  const match = matchRoute(routes, sub);
  if (!match) return false;
  return { routeParams: match.params, pageContext: { remote: "champions", subPath: sub } };
};
```

Shell's `pages/champions/+Page.tsx`:

```tsx
const ChampionsApp = lazy(() => import("remote-champions/App"));
export default function Page() {
  return <ChampionsApp />; // routes resolved internally using pageContext.subPath
}
```

Shell's `pages/champions/+data.ts` simply forwards to the remote loader so
Vike's data system stays uniform:

```ts
import { resolveData } from "remote-champions/routes";
export const data = (ctx: PageContextServer) => resolveData(ctx);
```

Why this shape:

- Vike continues to drive routing, data, head tags, and SSR. No second
  router gets involved on horizontal MFEs.
- Cross-MFE links (`/tier-list` → `/champions/ahri`) use Vike's Client
  Routing and `<Link>` — **no full page reload**.
- Sub-route navigation inside a horizontal MFE (`/champions` →
  `/champions/ahri`) is also Vike client routing, since each sub-route is
  re-resolved through the shell's `+route.ts`.

### Remote routing (vertical MFE)

Shell `pages/player/+route.ts`: `/player/*` catch-all.

```tsx
// pages/player/+Page.tsx
export default function Page() {
  const { user } = usePageContext();
  return <rift-player-app user={JSON.stringify(user)} />;
}
```

`<rift-player-app>` is the Stencil component; internally it uses its own
sub-router. Navigating **within** the player UI does not round-trip Vike;
navigating **out of** `/player/*` triggers a Vike navigation.

---

## 6. Bundle Sharing

### Shared singletons (Module Federation `shared` config)

In every horizontal app:

```ts
shared: {
  react:                 { singleton: true, requiredVersion: "^19.0.0" },
  "react-dom":           { singleton: true, requiredVersion: "^19.0.0" },
  "vike":                { singleton: true },
  "vike-react":          { singleton: true },
  "jotai":               { singleton: true },
  "@rift/champion":      { singleton: true },
  "@rift/player":        { singleton: true },
  "@rift/data-access":   { singleton: true },
  "@rift/ui":            { singleton: true },
  "@rift/ui/react":      { singleton: true },
}
```

### CSS / Tailwind v4

Tailwind v4 is CSS-first (`@theme`, `@source`, `@layer`) and **cannot** be
"emitted once and used everywhere" because each app's utility CSS is built
by scanning its own source files. Solution: split into **3 layers** so only
one of them is per-MFE.

| Layer                                                     | Owned by      | Loaded                          | Contents                                                               |
| --------------------------------------------------------- | ------------- | ------------------------------- | ---------------------------------------------------------------------- |
| 1. Design tokens (`@theme`) + reset + reusable components | `libs/styles` | Shell `+Layout.tsx`, **once**   | CSS variables, base/preflight, named classes (`.btn`, `.card`, …)      |
| 2. `lol-*` web-component CSS                              | `libs/ui`     | With the component (Shadow DOM) | Scoped — zero leakage                                                  |
| 3. Per-MFE utility classes                                | each MFE      | With the MFE remote bundle      | Only the utilities **that MFE actually uses** (Tailwind v4 JIT output) |

Key points:

- **Tokens become CSS variables** (`--color-primary`, `--radius-md`, …). Once
  emitted on `:root` by layer 1, every MFE's utilities (`bg-primary`,
  `rounded-md`) resolve against them — no duplication of token values.
- **Reusable component classes** (`.btn`, `.card`) live in
  `libs/styles/src/components.css` under `@layer components` and ship in
  layer 1 only.
- **Per-MFE utilities are tiny** (~3–8 KB gz each); duplicate
  `.flex { display: flex }` across two MFE bundles is harmless.
- **Stencil component CSS** is Shadow-DOM-scoped, fully isolated.
- **Do NOT** point shell's `@source` at MFE source paths — that recouples
  deploys. Each MFE owns its own `@source` block.

Layout shape:

```css
/* libs/styles/src/index.css — imported ONCE by shell */
@import "tailwindcss";
@source "./components.css";  /* shell scans only its own + libs/styles */

@theme {
  --color-primary: oklch(...);
  --radius-md: 0.5rem;
  /* …design tokens… */
}

@layer base {
  /* preflight overrides, font-face, etc. */
}

@layer components {
  .btn { @apply inline-flex items-center px-4 py-2 rounded-md ...; }
  .card { @apply rounded-md bg-card text-card-foreground shadow ...; }
}
```

```css
/* apps/mfe-champions/src/styles.css — ships with the MFE bundle */
@import "tailwindcss";
@source "./pages";
@source "./components";
/* No @theme block — inherits CSS variables from shell */
/* No component classes — already provided by shell */
```

### Expected payload (rough)

| Asset                        | Today     | After     |
| ---------------------------- | --------- | --------- |
| React + ReactDOM (per MFE)   | ~45 KB×3  | ~45 KB×1  |
| vike-react runtime (per MFE) | ~20 KB×3  | ~20 KB×1  |
| `@rift/champion` (per MFE)   | ~6 KB×3   | ~6 KB×1   |
| Per-MFE app code             | unchanged | unchanged |

---

## 7. Independent Deployability

- Each horizontal MFE builds to `dist/` containing a `remoteEntry.js` and
  `mf-manifest.json`. Deploy these to any static host (S3 + CloudFront, etc.)
  behind a stable URL, e.g.:
  - `https://cdn.rift.dev/mfe-champions/<gitsha>/remoteEntry.js`
  - `https://cdn.rift.dev/mfe-tier-list/<gitsha>/remoteEntry.js`
- The shell reads remote URLs from env at boot:

  ```ts
  federation({
    name: "shell",
    remotes: {
      "remote-champions": { type: "module", entry: process.env.MFE_CHAMPIONS_URL!, name: "mfe_champions" },
      "remote-tier-list": { type: "module", entry: process.env.MFE_TIERLIST_URL!, name: "mfe_tier_list" },
    },
    shared: { /* see §6 */ },
  });
  ```

- A new MFE version is rolled out by:
  1. Building & uploading the remote bundle.
  2. Updating the shell's `MFE_CHAMPIONS_URL` env var (no shell rebuild).
  3. Optional: zero-downtime by atomically swapping the URL.

- Server-side: each MFE's Hono router lives in its package. Updating the API
  **does** require a shell deploy (because we chose "one server"). Trade-off
  acknowledged — see §10.

- Vertical MFE: deploy `rift-player.js` + `rift-player.css` to CDN. Shell
  `+Head` hook references them via env var.

---

## 8. SSR + Hydration Story

- Shell's Vike server calls `renderPage(pageContextInit)` for every URL.
- For shell-owned routes: ordinary Vike SSR.
- For `/champions/*` and `/tier-list/*`:
  - Vike runs the shell's `+route.ts`, which imports `remote-champions/routes`
    via `@module-federation/vite`'s **server-side runtime** (works because MF
    has SSR support; remote modules are fetched and cached server-side).
  - `+data.ts` runs the remote's loader server-side and returns serializable
    data.
  - `+Page.tsx` renders the remote's `App` component to HTML.
  - Hydration boot: the shell's HTML includes `<script>` tags for the remote
    entry; the client MF runtime resolves them and React hydrates seamlessly.
- For `/player/*`:
  - Server pre-renders the Stencil component using
    `@stencil/core/internal/testing` (or a minimal hydrate script).
  - HTML ships with the pre-rendered DOM and a `<script type="module"
    src="rift-player.js">` tag; Stencil hydrates the custom element on
    `connectedCallback`.

### Streaming

- Keep `vike-react`'s built-in HTML streaming. Remote module loading is
  awaited before the relevant Suspense boundary resolves; the shell shell
  (header, layout) streams immediately.

---

## 9. Phased Implementation

> Each phase is independently shippable and verifiable. Stop at any phase if
> ROI of the next is unclear.

### Phase A — Consolidate the server (no MF yet)

Outcome: one Node process, one Auth.js, no behavioural change for users.

- A.1. Create `libs/styles/` with Tailwind preset + base CSS.
- A.2. Move `authjs-handler.ts` from `apps/shell/server` and
  `apps/mfe-player/server` into `libs/auth/` (new lib).
- A.3. For each MFE, refactor `server/<mfe>-handler.ts` to export a `Hono`
  sub-router (no `vike()` call inside). Add `"./server"` export to its
  `package.json`.
- A.4. Delete `+server.ts` and `server/hono.ts` from each MFE.
- A.5. Update shell's `server/hono.ts` to mount all MFE routers.
- A.6. Update shell's `+Layout.tsx` to render the canonical header (already
  does, but using `<Link>` not `<a href>`).
- A.7. Delete each MFE's local header from its `+Layout.tsx`; have it just
  render `{children}`.
- A.8. Update root `package.json` `dev`/`build` scripts: only `nx run
  shell:dev` runs a server.
- A.9. Verify: hit `/`, `/champions`, `/tier-list`, `/player` against the
  shell's port (3000 only). Auth flows still work.

> At this point we already have ONE server, consistent header, shared auth.
> Navigation between top-level routes still works because they're all served
> from the same Vike instance — but each MFE's pages still live in
> `apps/<mfe>/pages/`. We migrate those next.

### Phase B — Pull horizontal MFE pages into the shell's Vike app

Outcome: the shell is the sole Vike app for horizontal MFEs. Pages physically
live in their own packages and are imported.

- B.1. Move `apps/mfe-champions/pages/**` into
  `apps/mfe-champions/src/pages/**`. Add `"./pages": "./src/pages/index.ts"`
  to package exports (a manifest of page configs).
- B.2. Repeat for `mfe-tier-list`.
- B.3. Add a Vike custom config in shell that consumes those page manifests
  via filesystem routing replacement (Vike supports
  [external page modules](https://vike.dev/extensions) via `+config.ts`).
- B.4. Verify: navigation between champions and tier-list uses Vike Client
  Routing — no full reload.

### Phase C — Introduce Module Federation for horizontal MFEs

Outcome: horizontal MFEs are independently buildable & deployable; their
bundles are loaded at runtime and **share** React/vike-react with shell.

- C.1. Add `@module-federation/vite` to shell + horizontal MFE
  `vite.config.ts`.
- C.2. Configure each horizontal MFE as a `remote` exposing `./routes` and
  `./App`.
- C.3. Configure shell as `host` with `shared: { singleton: true }` for the
  list in §6.
- C.4. Replace the in-tree imports from B.3 with `import("remote-champions/…")`
  using Vite's `optimizeDeps.exclude` so dev mode hot-reload still works.
- C.5. Add an env-driven manifest (`MFE_*_URL`) for prod.
- C.6. Verify (dev): edit a champions page, see HMR in shell.
- C.7. Verify (prod): build both apps separately, deploy mfe-champions to a
  test URL, point shell at it, redeploy only the MFE → change visible without
  shell rebuild.

### Phase D — Convert mfe-player to vertical (Stencil)

Outcome: a working example of a different-stack MFE.

- D.1. Add `apps/mfe-player/stencil.config.ts` with `dist-custom-elements` +
  `hydrate` output targets.
- D.2. Author `<rift-player-app>` as a Stencil component using
  `@stencil/router` (or a small hand-rolled router) for sub-routes.
- D.3. Move data fetching to inside the component using
  `@rift/data-access` clients (which are vanilla `fetch`-based already).
- D.4. Add shell `pages/player/+Page.tsx` that mounts the element.
- D.5. SSR via Stencil's `hydrate` runtime invoked from
  `pages/player/+onRenderHtml.ts`.
- D.6. Verify: deep-link to `/player/match-history` returns server-rendered
  HTML; client takes over; intra-player navigation does not call the shell.

### Phase E — Performance polish

- E.1. Audit shared chunks with `mf-stats.json`; ensure no duplicate React.
- E.2. Add `<Link prefetch>` on header nav so MF remote entries are prefetched
  on hover.
- E.3. Add Lighthouse CI checks for LCP/INP per route.
- E.4. Add a tiny "skeleton" while a remote is loading the first time.
- E.5. Consider `vike-react-query` for client-cached subsequent loads.

---

## 10. Trade-offs & Risks

| Trade-off                                                   | Mitigation                                                                     |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------ |
| One server means API changes still need a shell deploy.     | Acceptable per requirements; Phase F (future) can split API to a separate Hono |
| MF SSR is newer than CSR — edge cases possible.             | Pin `@module-federation/vite` version; add Playwright SSR tests per route      |
| Vike + MF route-function-as-delegate is non-trivial.        | Encapsulate in a single helper `createRemoteRoute(name)` reused by all MFEs    |
| Vertical MFE uses different SSR pipeline (Stencil hydrate). | Isolated to `/player/*`; does not affect horizontal MFE rendering              |
| Tailwind class collisions between shell and remotes.        | Shared preset in `libs/styles`; remotes never re-emit base layer               |
| Auth.js secret is currently hardcoded.                      | Phase A.2 must migrate to `process.env.AUTH_SECRET`                            |
| Cross-MFE state in jotai — singleton requirement.           | `jotai` declared `singleton: true`; shell creates the root Provider            |
| Stencil hydration cost on `/player/*`.                      | Acceptable for the explicit "vertical" example; opt out of full SSR if needed  |

---

## 11. Resolved Decisions

1. **`mfe-player` is the Stencil vertical** (not a 4th horizontal). Reuses the
   `libs/ui` Stencil toolchain.
2. **1:1 route prefix per MFE.** `/champions/*` → `mfe-champions`, etc. No
   shared prefix mapping layer.
3. **Hybrid bundle delivery, env-driven:**
   - **Local dev**: same-origin. Shell's Vite dev server proxies
     `/_mfe/<name>/*` to the MFE's local Vite dev process (or, when running
     shell-only, serves the locally-built `dist/`). No CORS needed.
   - **Prod**: CDN with CORS. Shell reads `MFE_*_URL` env vars; remote
     bundles deployed independently.
   - **"Load on the server" option**: the MF runtime already fetches remote
     `mf-manifest.json` from the shell's Node process during SSR (server-side
     federation). The browser then fetches the actual JS chunks from the URL
     in the manifest. So:
       - SSR phase = server fetches manifest from CDN (or localhost in dev),
         caches it in memory.
       - Hydration phase = browser fetches JS chunks directly from CDN
         (parallel to React hydration).
     This is the recommended setup; "server proxies all chunks" is possible
     but loses the CDN edge benefit and is not needed.
4. **Reuse Valibot schemas** at the shell↔remote boundary. Each remote's
   `+data` loader returns Valibot-typed output; shell's wrapper validates on
   the way out (defense-in-depth, since remotes can be deployed independently
   and may drift).
5. **NX scopes**:
   - `scope:shell` — apps/shell
   - `scope:mfe` — apps/mfe-*
   - `scope:lib-domain` — libs/champion, libs/player
   - `scope:lib-shared` — libs/ui, libs/styles, libs/auth, libs/data-access,
     libs/mfe-runtime
   - Allowed edges:
     - `scope:shell` → `scope:mfe` (new — needed for MF host wiring)
     - `scope:shell` / `scope:mfe` → `scope:lib-*`
     - `scope:lib-domain` → `scope:lib-domain` (player → champion only)
     - `scope:lib-shared` may depend on `scope:lib-domain` (data-access does)
     - No cross-MFE imports (`mfe-champions` cannot import `mfe-tier-list`)

---

## 12. Files / Packages Affected

New:
- `libs/styles/` (Tailwind preset + base CSS)
- `libs/auth/` (Auth.js shared config and middleware)
- `libs/mfe-runtime/` (helpers: `createRemoteRoute`, `useUser`, `<Link>`)

Modified:
- `apps/shell/vite.config.ts` (+ MF host plugin)
- `apps/shell/server/hono.ts` (mount all MFE routers)
- `apps/shell/pages/+Layout.tsx` (canonical header, Vike `<Link>`)
- `apps/shell/pages/{champions,tier-list,player}/{+route.ts,+Page.tsx,+data.ts}` (new)
- `apps/mfe-champions/vite.config.ts` (+ MF remote plugin, removed Vike server)
- `apps/mfe-champions/package.json` (added `./server`, `./routes`, `./App` exports)
- Same for `apps/mfe-tier-list`
- `apps/mfe-player/stencil.config.ts` (new), `apps/mfe-player/src/components/**`

Removed:
- `apps/mfe-champions/+server.ts`, `apps/mfe-champions/server/hono.ts`
- `apps/mfe-tier-list/+server.ts`, `apps/mfe-tier-list/server/hono.ts`
- `apps/mfe-player/+server.ts`, `apps/mfe-player/server/hono.ts`
- `apps/mfe-player/server/authjs-handler.ts` (moved to `libs/auth`)
- `apps/shell/server/authjs-handler.ts` (moved to `libs/auth`)
- Per-MFE local header markup in `+Layout.tsx`

---

## 13. Recommendations Summary

1. **Adopt `@module-federation/vite`** for the two horizontal MFEs. Skip
   OpenComponents — wrong fit for this monorepo's scale and dev model.
2. **Collapse to one Hono server in shell**; mount MFE routers as packages.
3. **Keep Vike as the only router** for the React stack; treat horizontal
   remotes as "page providers" not "apps with their own router".
4. **Use Stencil for the vertical example** (`mfe-player`) — leverages the
   existing `libs/ui` Stencil toolchain and gives a clean
   different-stack story.
5. **Phase A first** (server consolidation + shared header) — biggest
   immediate quality win, no MF complexity yet.
6. **Defer cross-MFE state** until needed; jotai singleton is enough for v1.
