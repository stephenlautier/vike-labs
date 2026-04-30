import { getSession, type RiftSession } from "@rift/auth";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export type AuthVariables = {
	session: RiftSession | null;
};

/**
 * Read the Auth.js session cookie and put the session (or null) on context.
 * Always runs; routes that require auth use `requireUser` after this.
 */
export const sessionMiddleware = createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
	let session: RiftSession | null = null;
	try {
		session = await getSession(c.req.raw);
	} catch (err) {
		console.debug("sessionMiddleware:", err);
	}
	c.set("session", session);
	await next();
});

/**
 * Throws 401 unless an authenticated user is on the context.
 * Returns the user when called from a route handler.
 */
export const requireUser = createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
	const session = c.get("session");
	if (!session?.user?.id) {
		throw new HTTPException(401, { message: "Unauthorized" });
	}
	await next();
});
