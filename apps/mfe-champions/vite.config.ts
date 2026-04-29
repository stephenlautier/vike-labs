import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import vike from "vike/plugin";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [vike(), react(), tailwindcss()],
	resolve: {
		// Most-specific subpath aliases must come before the base package alias.
		alias: [
			{ find: "@rift/ui/react", replacement: path.resolve(__dirname, "../../libs/ui/src/react/components.ts") },
			{ find: "@rift/ui/dist/components", replacement: path.resolve(__dirname, "../../libs/ui/dist/components") },
			{ find: "@rift/ui", replacement: path.resolve(__dirname, "../../libs/ui/src/index.ts") },
			{ find: "@rift/champion", replacement: path.resolve(__dirname, "../../libs/champion/src/index.ts") },
			{ find: "@", replacement: path.resolve(__dirname, "./src") },
		],
	},
	// Exclude workspace packages from Vite's dep pre-bundler — they are handled
	// source-first via the aliases above and must not be pre-bundled from dist.
	optimizeDeps: {
		exclude: ["@rift/ui", "@rift/champion"],
	},
	// Force Vite to bundle workspace packages into the SSR output rather than
	// externalising them. Without this, Node would try to import the raw
	// TypeScript sources from the package exports map and fail at runtime.
	ssr: {
		noExternal: ["@rift/ui", "@rift/champion", "@stencil/react-output-target"],
	},
});
