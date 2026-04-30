import { authjsHandler, authjsSessionMiddleware } from "@rift/auth";
import vike from "@vikejs/hono";
import { Hono } from "hono";

const API_TARGET = process.env.RIFT_API_URL ?? "http://localhost:3100";

function getApp(): Hono {
	const app = new Hono();

	// Proxy `/api/*` to `@rift/api` (mirrors the Vite dev-server proxy so the
	// browser can talk to the same origin in both dev and prod). Auth.js
	// routes (`/api/auth/**`) are intercepted earlier by `authjsHandler`.
	app.all("/api/*", async c => {
		const url = new URL(c.req.url);
		const target = `${API_TARGET}${url.pathname.replace(/^\/api/, "")}${url.search}`;
		const init: RequestInit = {
			method: c.req.method,
			headers: c.req.raw.headers,
		};
		if (c.req.method !== "GET" && c.req.method !== "HEAD") {
			init.body = await c.req.raw.arrayBuffer();
		}
		return fetch(target, init);
	});

	vike(app, [
		// Append Auth.js session to context
		authjsSessionMiddleware,

		// Auth.js route. See https://authjs.dev/getting-started/installation
		authjsHandler,
	]);

	return app;
}

export const app = getApp();
