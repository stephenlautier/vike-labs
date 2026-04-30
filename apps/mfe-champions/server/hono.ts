import vike from "@vikejs/hono";
import { Hono } from "hono";

import { registerChampionsRoutes } from "./champions-handler";

function getApp() {
	const app = new Hono();

	registerChampionsRoutes(app);
	vike(app);

	return app;
}

export const app = getApp();
