import { SEED_ABILITIES, SEED_CHAMPIONS, SEED_SKINS } from "@rift/champion";
import type { Hono } from "hono";

export function registerChampionsRoutes(app: Hono): void {
	app.get("/api/champions", c => {
		return c.json(SEED_CHAMPIONS);
	});

	app.get("/api/champions/:id", c => {
		const { id } = c.req.param();
		const champion = SEED_CHAMPIONS.find(ch => ch.id === id);
		if (!champion) {
			return c.json({ message: "Champion not found" }, 404);
		}
		const abilities = SEED_ABILITIES.filter(a => a.championId === id);
		const skins = SEED_SKINS.filter(s => s.championId === id);
		return c.json({ ...champion, abilities, skins });
	});
}
