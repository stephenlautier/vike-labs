import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

/**
 * `mfe-champions` is a Module Federation **remote** (Phase D-A). It is not a
 * standalone Vike app — it only emits `remoteEntry.js` plus the chunks for
 * the page modules listed under `exposes`. The shell loads these on the
 * client at runtime; SSR continues to import the same modules in-tree via
 * the package `exports` map (see `package.json`).
 *
 * Dev story: shell (`vite dev`) imports the page modules through the
 * workspace `@rift/mfe-champions/...` aliases, so HMR works exactly like a
 * normal monorepo. The remote build is only needed for `pnpm preview` /
 * production deploys.
 */
export default defineConfig({
	plugins: [
		react(),
		federation({
			name: "mfe-champions",
			filename: "remoteEntry.js",
			exposes: {
				"./pages/champions-list": "./src/pages/champions-list/Page.tsx",
				"./pages/champion-detail": "./src/pages/champion-detail/Page.tsx",
			},
			shared: {
				react: { singleton: true, requiredVersion: "^19.0.0" },
				"react/": {},
				"react-dom": { singleton: true, requiredVersion: "^19.0.0" },
				"react-dom/": {},
				vike: { singleton: true },
				"vike-react": { singleton: true },
			},
			manifest: true,
			// `@module-federation/dts-plugin` peer-requires TS ^4–5 (we run TS 6) and
			// runs a `tsc` over `exposes` whose path-alias imports cause `.d.ts`
			// files to leak into `libs/*/src/`. The shell consumes our pages via
			// the package `exports` map, so MF type sharing is unnecessary.
			dts: false,
		}),
	],
	resolve: {
		// Most-specific subpath aliases must come before the base package alias.
		alias: [
			{ find: "@rift/ui/react", replacement: path.resolve(__dirname, "../../libs/ui/src/react/components.ts") },
			{ find: "@rift/ui/dist/components", replacement: path.resolve(__dirname, "../../libs/ui/dist/components") },
			{ find: "@rift/ui", replacement: path.resolve(__dirname, "../../libs/ui/src/index.ts") },
			{ find: "@rift/champion", replacement: path.resolve(__dirname, "../../libs/champion/src/index.ts") },
			{ find: "@rift/data-access", replacement: path.resolve(__dirname, "../../libs/data-access/src/index.ts") },
		],
	},
	build: {
		target: "esnext",
		minify: true,
		cssCodeSplit: false,
	},
	server: {
		port: 3001,
		strictPort: true,
		// Required so the shell can fetch this remote's manifest in dev/preview.
		origin: process.env.MFE_CHAMPIONS_URL ?? "http://localhost:3001",
	},
	preview: {
		port: 3001,
		strictPort: true,
	},
});
