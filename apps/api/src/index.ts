import { serve } from "@hono/node-server";

import { app } from "./app";

const PORT = Number.parseInt(process.env.PORT ?? "3100", 10);

serve({ fetch: app.fetch, port: PORT }, info => {
	console.log(`@rift/api listening on http://localhost:${info.port}`);
});
