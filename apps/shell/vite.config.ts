import { federation } from "@module-federation/vite";
import { stencilSSR } from "@stencil/ssr";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import vike from "vike/plugin";
import { defineConfig } from "vite";

/**
 * Default URLs for the horizontal MFE remotes. These match the `server.port`
 * values in each MFE's `vite.config.ts`. In CI/prod they should be supplied
 * via env (see `MFE_*_URL` below) so a remote can be redeployed independently.
 */
const MFE_CHAMPIONS_URL = process.env.MFE_CHAMPIONS_URL ?? "http://localhost:3001";
const MFE_TIER_LIST_URL = process.env.MFE_TIER_LIST_URL ?? "http://localhost:3002";

export default defineConfig(({ command }) => ({
	plugins: [
		vike(),
		react(),
		tailwindcss(),
		// Compile-time SSR for the Stencil player MFE. The plugin intercepts JSX
		// that references components from `@rift/mfe-player/react`, calls the
		// hydrate module, and replaces them with pre-rendered Declarative
		// Shadow-DOM wrappers so the markup is server-rendered.
		stencilSSR({
			module: import("@rift/mfe-player/react"),
			from: "@rift/mfe-player/react",
			hydrateModule: import("@rift/mfe-player/hydrate"),
			serializeShadowRoot: { default: "declarative-shadow-dom" },
		}),
		// Federation host registration is build-only. In dev, the shell still
		// imports MFE pages in-tree via the workspace `exports` map (Phase C
		// wiring), so HMR works exactly like a normal monorepo. Loading the
		// MF plugin in dev mode breaks Vike's `+server.ts` resolution
		// ("Default export from undefined must include a { fetch() } function").
		// D-A.5 will revisit dev-mode federation if/when we switch to dynamic
		// `import("mfe-*/pages/...")` at the import site.
		...(command === "build"
			? [
					federation({
						name: "shell",
						// Remotes are referenced as `<name>@<manifest-url>`. The plugin
						// fetches each `mf-manifest.json` at build time to know what's
						// exposed and at runtime to load chunks.
						remotes: {
							"mfe-champions": {
								type: "module",
								name: "mfe-champions",
								entry: `${MFE_CHAMPIONS_URL}/mf-manifest.json`,
							},
							"mfe-tier-list": {
								type: "module",
								name: "mfe-tier-list",
								entry: `${MFE_TIER_LIST_URL}/mf-manifest.json`,
							},
						},
						shared: {
							react: { singleton: true, requiredVersion: "^19.0.0" },
							"react/": {},
							"react-dom": { singleton: true, requiredVersion: "^19.0.0" },
							"react-dom/": {},
							vike: { singleton: true },
							"vike-react": { singleton: true },
							jotai: { singleton: true },
						},
						// See note in MFE configs: peer-version mismatch with TS 6.
						dts: false,
					}),
				]
			: []),
	],
	server: {
		proxy: {
			// In dev, browser fetches to `/api/*` are proxied to apps/api on :3100
			// (with the `/api` prefix stripped). Auth.js routes (`/api/auth/**`) are
			// served by the shell's own Hono server before reaching this proxy.
			"/api": {
				target: process.env.RIFT_API_URL ?? "http://localhost:3100",
				changeOrigin: true,
				rewrite: p => p.replace(/^\/api/, ""),
			},
		},
	},
	resolve: {
		// Most-specific subpath aliases must come before the base package alias.
		alias: [
			{ find: "@rift/ui/react", replacement: path.resolve(__dirname, "../../libs/ui/src/react/components.ts") },
			{ find: "@rift/ui/dist/components", replacement: path.resolve(__dirname, "../../libs/ui/dist/components") },
			{ find: "@rift/ui", replacement: path.resolve(__dirname, "../../libs/ui/src/index.ts") },
			{
				find: "@rift/mfe-player/react",
				replacement: path.resolve(__dirname, "../mfe-player/src/react/components.ts"),
			},
			{
				find: "@rift/mfe-player/hydrate",
				replacement: path.resolve(__dirname, "../mfe-player/hydrate/index.mjs"),
			},
			{
				find: "@rift/mfe-player/loader",
				replacement: path.resolve(__dirname, "../mfe-player/loader/index.js"),
			},
			{
				find: "@rift/mfe-player/dist/components",
				replacement: path.resolve(__dirname, "../mfe-player/dist/components"),
			},
			{
				find: "@rift/mfe-player",
				replacement: path.resolve(__dirname, "../mfe-player/dist/index.js"),
			},
			{ find: "@rift/champion", replacement: path.resolve(__dirname, "../../libs/champion/src/index.ts") },
			{ find: "@rift/data-access", replacement: path.resolve(__dirname, "../../libs/data-access/src/index.ts") },
			{ find: "@", replacement: path.resolve(__dirname, "./src") },
		],
	},
	optimizeDeps: {
		exclude: [
			"@rift/ui",
			"@rift/champion",
			"@rift/data-access",
			"@rift/mfe-champions",
			"@rift/mfe-player",
			"@rift/mfe-tier-list",
		],
	},
	ssr: {
		noExternal: [
			"@rift/ui",
			"@rift/champion",
			"@rift/data-access",
			"@rift/mfe-champions",
			"@rift/mfe-player",
			"@rift/mfe-tier-list",
			"@stencil/react-output-target",
		],
	},
}));
