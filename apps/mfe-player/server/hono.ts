import vike from "@vikejs/hono";
import { Hono } from "hono";

import { authjsHandler, authjsSessionMiddleware } from "./authjs-handler";
import { createTodoHandler } from "./create-todo-handler";

function getApp() {
	const app = new Hono();

	vike(app, [
		// Append Auth.js session to context
		authjsSessionMiddleware,

		// Auth.js route. See https://authjs.dev/getting-started/installation
		authjsHandler,

		createTodoHandler,
	]);

	return app;
}

export const app = getApp();
