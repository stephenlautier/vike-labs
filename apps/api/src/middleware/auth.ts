import { createMiddleware } from "hono/factory";

/**
 * Minimal session shape consumed by routes. Auth0/Auth.js is currently
 * disabled — see `mockSession` below.
 */
export type MockSession = {
	user: {
		id: string;
		name?: string;
		email?: string;
	};
};

export type AuthVariables = {
	session: MockSession | null;
};

/**
 * Mock session matching the seeded demo player (`auth0Sub: "auth0|rift-demo"`
 * in `src/db/seed.ts`). Auth0 is disabled for now; every request is treated
 * as the demo user so guarded routes (`/player/*`) work without a login flow.
 */
const mockSession: MockSession = {
	user: {
		id: "auth0|rift-demo",
		name: "Rift Demo",
		email: "demo@rift.local",
	},
};

/**
 * Always attaches the mock session to the request context.
 */
export const sessionMiddleware = createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
	c.set("session", mockSession);
	await next();
});

/**
 * No-op while auth0 is disabled — the mock session always satisfies the
 * "authenticated user" requirement.
 */
export const requireUser = createMiddleware<{ Variables: AuthVariables }>(async (_c, next) => {
	await next();
});
