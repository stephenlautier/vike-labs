// oxlint-disable typescript/explicit-function-return-type
import type { ApiType } from "@rift/api";
import { hc } from "hono/client";

/**
 * Create a fully typed Hono client for `@rift/api`. Pass an empty string in
 * the browser when the dev/prod environment proxies `/api/*` to the API; pass
 * an absolute URL on the server (Vike `+data.ts`) so SSR fetches don't need
 * a host. Cookies are forwarded for guarded `/player/*` routes via
 * `credentials: "include"` set automatically when called from a same-site
 * proxy; pass `init: { fetch }` to override.
 */
export function createApiClient(baseUrl: string) {
	return hc<ApiType>(baseUrl, {
		init: { credentials: "include" },
	});
}

export type ApiClient = ReturnType<typeof createApiClient>;
