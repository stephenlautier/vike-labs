import { PlayerChampionSchema, PlayerMatchEntrySchema, PlayerSchema } from "@rift/player";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import * as v from "valibot";

import { db, schema } from "../db/client";
import { requireUser } from "../middleware/auth";
import type { AuthVariables } from "../middleware/auth";

const PlayerChampionsSchema = v.array(PlayerChampionSchema);
const PlayerMatchesSchema = v.array(PlayerMatchEntrySchema);

async function loadPlayerByAuth0Sub(auth0Sub: string): Promise<typeof schema.players.$inferSelect> {
	const player = await db.select().from(schema.players).where(eq(schema.players.auth0Sub, auth0Sub)).get();
	if (!player) {
		throw new HTTPException(404, { message: "Player not found" });
	}
	return player;
}

export const playerRoute = new Hono<{ Variables: AuthVariables }>()
	.use("*", requireUser)
	.get("/me", async c => {
		const session = c.get("session");
		const player = await loadPlayerByAuth0Sub(session.user.id);
		return c.json(v.parse(PlayerSchema, player));
	})
	.get("/me/champions", async c => {
		const session = c.get("session");
		const player = await loadPlayerByAuth0Sub(session.user.id);
		const rows = await db
			.select()
			.from(schema.playerChampions)
			.where(eq(schema.playerChampions.playerId, player.id))
			.all();
		return c.json(v.parse(PlayerChampionsSchema, rows));
	})
	.get("/me/matches", async c => {
		const session = c.get("session");
		const player = await loadPlayerByAuth0Sub(session.user.id);
		const rows = await db.select().from(schema.playerMatches).where(eq(schema.playerMatches.playerId, player.id)).all();
		return c.json(v.parse(PlayerMatchesSchema, rows));
	});
