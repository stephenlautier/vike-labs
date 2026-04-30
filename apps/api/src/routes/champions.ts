import { ChampionAbilitySchema, ChampionSchema, ChampionSkinSchema } from "@rift/champion";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import * as v from "valibot";

import { db, schema } from "../db/client";

const ChampionListSchema = v.array(ChampionSchema);
const ChampionDetailSchema = v.object({
	champion: ChampionSchema,
	abilities: v.array(ChampionAbilitySchema),
	skins: v.array(ChampionSkinSchema),
});

export const championsRoute = new Hono()
	.get("/", async c => {
		const rows = await db.select().from(schema.champions).all();
		return c.json(v.parse(ChampionListSchema, rows));
	})
	.get("/:id", async c => {
		const id = c.req.param("id");
		const champion = await db
			.select()
			.from(schema.champions)
			.where(eq(schema.champions.id, id))
			.get();
		if (!champion) throw new HTTPException(404, { message: `Champion ${id} not found` });

		const abilities = await db
			.select()
			.from(schema.championAbilities)
			.where(eq(schema.championAbilities.championId, id))
			.all();
		const skins = await db
			.select()
			.from(schema.championSkins)
			.where(eq(schema.championSkins.championId, id))
			.all();

		return c.json(
			v.parse(ChampionDetailSchema, {
				champion,
				abilities: abilities.map(a => ({ ...a, cooldown: a.cooldown ?? undefined })),
				skins,
			}),
		);
	});
