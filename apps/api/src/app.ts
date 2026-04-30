import { Hono } from "hono";
import { logger } from "hono/logger";

import { sessionMiddleware } from "./middleware/auth";
import type { AuthVariables } from "./middleware/auth";
import { corsMiddleware } from "./middleware/cors";
import { championsRoute } from "./routes/champions";
import { healthRoute } from "./routes/health";
import { playerRoute } from "./routes/player";
import { tierListRoute } from "./routes/tier-list";

/**
 * The Hono app for `@rift/api`. The chained `.route()` calls preserve the
 * full route map so consumers can derive a typed client via
 * `hc<ApiType>("…")`.
 */
export const app = new Hono<{ Variables: AuthVariables }>()
	.use("*", logger())
	.use("*", corsMiddleware)
	.use("*", sessionMiddleware)
	.route("/health", healthRoute)
	.route("/champions", championsRoute)
	.route("/tier-list", tierListRoute)
	.route("/player", playerRoute);

export type ApiType = typeof app;
