import { authjsHandler, authjsSessionMiddleware } from "@rift/auth";
import vike from "@vikejs/hono";
import { Hono } from "hono";

function getApp(): Hono {
	const app = new Hono();

	vike(app, [
		// Append Auth.js session to context
		authjsSessionMiddleware,

		// Auth.js route. See https://authjs.dev/getting-started/installation
		authjsHandler,
	]);

	return app;
}

export const app = getApp();
