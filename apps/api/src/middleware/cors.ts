import { cors } from "hono/cors";

const SHELL_ORIGIN = process.env.SHELL_ORIGIN ?? "http://localhost:3000";

/**
 * CORS allowing the shell origin to call the API with credentials so the
 * Auth.js cookie travels for guarded `/player/*` routes.
 */
export const corsMiddleware = cors({
	origin: [SHELL_ORIGIN],
	credentials: true,
	allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowHeaders: ["Content-Type", "Authorization"],
});
