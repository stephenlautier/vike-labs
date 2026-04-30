import { createMiddleware } from "hono/factory";

/**
 * Minimal session shape consumed by routes. The shell mints real Credentials
 * sessions via Auth.js, but cross-origin session sharing with the api is not
 * yet wired — see `mockSession` below.
 */
export type MockSession = {
	user: {
		id: string;
		name?: string;
		email?: string;
	};
};

export type AuthVariables = {
	session: MockSession;
};

/**
 * Mock session matching the seeded demo player (`subjectId: "rift-demo"`
 * in `src/db/seed.ts`). The shell mints real Credentials sessions but the
 * api currently can't read its cookie, so every request is treated as the
 * demo user. TODO: cross-origin session verification (mint a JWT in the
 * shell that the api can verify) — tracked separately.
 */
const mockSession: MockSession = {
	user: {
		id: "rift-demo",
		name: "RiftDemo",
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
 * No-op until cross-origin session verification is wired — the mock session
 * always satisfies the "authenticated user" requirement.
 */
export const requireUser = createMiddleware<{ Variables: AuthVariables }>(async (_c, next) => {
	await next();
});
