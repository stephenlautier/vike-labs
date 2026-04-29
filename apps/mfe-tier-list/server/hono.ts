import vike from "@vikejs/hono";
import { Hono } from "hono";

import { registerTierListRoutes } from "./tier-list-handler";

function getApp() {
	const app = new Hono();

	registerTierListRoutes(app);
	vike(app);

	return app;
}

export const app = getApp();
