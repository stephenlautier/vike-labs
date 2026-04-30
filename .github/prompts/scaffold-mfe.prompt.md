---
name: scaffold-mfe
description: Scaffold a new Vike MFE app in this monorepo and wire it up with NX
---

# Scaffold a New Vike MFE App

## Steps

### 1. Scaffold with Bati

```bash
cd apps
npm create vike@latest ${input:appName} -- --react --tailwindcss --shadcn-ui --hono --oxlint --storybook
```

### 2. Update `pnpm-workspace.yaml`

Ensure `apps/*` is in the workspaces list (it should already be there).

### 3. Add NX `project.json`

Create `apps/${input:appName}/project.json`:

```json
{
  "name": "${input:appName}",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "projectType": "application",
  "sourceRoot": "apps/${input:appName}/src",
  "tags": ["type:app", "scope:mfe"],
  "targets": {
    "dev": {
      "executor": "nx:run-commands",
      "options": { "command": "pnpm vike dev", "cwd": "apps/${input:appName}" }
    },
    "build": {
      "executor": "nx:run-commands",
      "options": {
        "command": "pnpm vike build",
        "cwd": "apps/${input:appName}"
      },
      "outputs": ["{workspaceRoot}/apps/${input:appName}/dist"]
    },
    "preview": {
      "executor": "nx:run-commands",
      "options": {
        "command": "pnpm vike preview",
        "cwd": "apps/${input:appName}"
      }
    },
    "test": {
      "executor": "@nx/vite:test",
      "options": { "configFile": "apps/${input:appName}/vitest.config.ts" }
    },
    "lint": {
      "executor": "nx:run-commands",
      "options": { "command": "pnpm oxlint .", "cwd": "apps/${input:appName}" }
    },
    "e2e": {
      "executor": "nx:run-commands",
      "options": {
        "command": "pnpm playwright test",
        "cwd": "apps/${input:appName}"
      }
    }
  }
}
```

### 4. Configure `vite.config.ts` for NX path aliases

Add the monorepo `libs/` path aliases:

```ts
// apps/${input:appName}/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
});
```

Ensure `tsconfig.json` references the root `tsconfig.base.json` which contains the path aliases.

### 5. Add `libs/ui` StencilJS React bindings

```ts
// apps/${input:appName}/src/main.tsx or app entry
import { defineCustomElements } from "@rift/ui/loader";
defineCustomElements();
```

### 6. Add `e2e/` directory with Playwright config

```bash
mkdir apps/${input:appName}/e2e
```

Create `apps/${input:appName}/playwright.config.ts`:

```ts
import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  webServer: {
    command: "pnpm nx run ${input:appName}:dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

### 7. Verify

```bash
pnpm nx run ${input:appName}:dev
pnpm nx run ${input:appName}:build
pnpm nx run ${input:appName}:test
```
