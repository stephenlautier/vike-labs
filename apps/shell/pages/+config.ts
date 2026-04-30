import vikeReact from "vike-react/config";
import type { Config } from "vike/types";

const config: Config = {
	title: "Rift — League of Legends",
	description: "League of Legends companion app",
	passToClient: ["session", "player", "theme"],
	extends: [vikeReact],
	ssr: true,
	// Stencil's React SSR wrapper (`@rift/ui/react`, `node` export) renders
	// each `lol-*` web component asynchronously so it can serialise the
	// declarative shadow DOM via the `@rift/ui/hydrate` module. That makes
	// the React tree suspend during SSR, which the legacy synchronous
	// `renderToString` cannot handle. Enabling `stream: "web"` switches
	// vike-react to React's web-streaming SSR (which supports Suspense and
	// async components) and gives Hono / @vikejs/hono a `ReadableStream` —
	// the Node.js Stream pipe variant is rejected by `@vikejs/hono`.
	stream: "web",
};

export default config;
