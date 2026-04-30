import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import vike from "vike/plugin";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [vike(), react(), tailwindcss()],
	server: {
		proxy: {
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
			{ find: "@rift/champion", replacement: path.resolve(__dirname, "../../libs/champion/src/index.ts") },
			{ find: "@rift/data-access", replacement: path.resolve(__dirname, "../../libs/data-access/src/index.ts") },
			{ find: "@", replacement: path.resolve(__dirname, "./src") },
		],
	},
	optimizeDeps: {
		exclude: ["@rift/ui", "@rift/champion", "@rift/data-access"],
	},
	ssr: {
		noExternal: ["@rift/ui", "@rift/champion", "@rift/data-access", "@stencil/react-output-target"],
	},
});
