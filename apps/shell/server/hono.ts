import { authjsHandler, authjsSessionMiddleware } from "@rift/auth";
import vike from "@vikejs/hono";
import { Hono } from "hono";
import fs from "node:fs";
import path from "node:path";

const API_TARGET = process.env.RIFT_API_URL ?? "http://localhost:3100";

/**
 * Where each MFE's `dist/` (with `mf-manifest.json`, `remoteEntry.js`
 * and chunk files) lives. Mounted under `/static-assets/mfes/<name>/*`
 * so the federation runtime can fetch them from the shell's own origin
 * in preview/prod — no separate static host required. In dev (`vite
 * dev`) the federation plugin is gated off entirely (workspace alias is
 * used instead) so this handler is only exercised by the production
 * server.
 *
 * Resolved relative to `process.cwd()`, which is `apps/shell/` for both
 * `vike preview` and the documented prod entry. Override with
 * `MFE_*_DIST` env vars when serving from a different working directory.
 */
const SHELL_CWD = process.cwd();
const MFE_MOUNTS: Record<string, string> = {
	"mfe-champions": path.resolve(SHELL_CWD, process.env.MFE_CHAMPIONS_DIST ?? "../mfe-champions/dist"),
	"mfe-tier-list": path.resolve(SHELL_CWD, process.env.MFE_TIER_LIST_DIST ?? "../mfe-tier-list/dist"),
};

const MIME_TYPES: Record<string, string> = {
	".js": "application/javascript; charset=utf-8",
	".mjs": "application/javascript; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".html": "text/html; charset=utf-8",
	".map": "application/json; charset=utf-8",
	".svg": "image/svg+xml",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".webp": "image/webp",
	".woff": "font/woff",
	".woff2": "font/woff2",
};

function findMfeMount(reqPath: string): { root: string; rel: string } | undefined {
	for (const [name, root] of Object.entries(MFE_MOUNTS)) {
		const prefix = `/static-assets/mfes/${name}/`;
		if (reqPath.startsWith(prefix)) {
			return { root, rel: reqPath.slice(prefix.length) };
		}
	}
	return undefined;
}

function getApp(): Hono {
	const app = new Hono();

	// Register as a global middleware (no path) so it runs before vike's
	// universal catch-all. We dispatch on the URL pathname ourselves
	// because path-scoped `app.get(path, handler)` registrations were
	// being shadowed by vike's `app.all("/*", ...)` in registration
	// order.
	// oxlint-disable typescript-eslint/consistent-return -- Hono middleware idiom: file-serve paths return a Response while fallthrough paths chain via next()
	app.use(async (c, next) => {
		const match = findMfeMount(c.req.path);
		if (!match) {
			await next();
			return;
		}
		// Reject path traversal.
		if (match.rel.includes("..")) {
			return c.notFound();
		}
		const filePath = path.join(match.root, match.rel);
		try {
			const stat = await fs.promises.stat(filePath);
			if (!stat.isFile()) {
				await next();
				return;
			}
			const buf = await fs.promises.readFile(filePath);
			const ext = path.extname(filePath).toLowerCase();
			const type = MIME_TYPES[ext] ?? "application/octet-stream";
			return new Response(buf, {
				status: 200,
				headers: {
					"content-type": type,
					"cache-control": "public, max-age=31536000, immutable",
				},
			});
		} catch {
			await next();
			return;
		}
	});
	// oxlint-enable typescript-eslint/consistent-return

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
