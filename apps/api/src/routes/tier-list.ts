import { ChampionRoleSchema, ChampionTierSchema, TierSchema } from "@rift/champion";
import { vValidator } from "@hono/valibot-validator";
import { and, eq, type SQL } from "drizzle-orm";
import { Hono } from "hono";
import * as v from "valibot";

import { db, schema } from "../db/client";

const QuerySchema = v.object({
	tier: v.optional(TierSchema),
	role: v.optional(ChampionRoleSchema),
	patch: v.optional(v.string()),
});

const TierListSchema = v.array(ChampionTierSchema);

export const tierListRoute = new Hono().get("/", vValidator("query", QuerySchema), async c => {
	const { tier, role, patch } = c.req.valid("query");
	const filters: SQL[] = [];
	if (tier) filters.push(eq(schema.championTiers.tier, tier));
	if (role) filters.push(eq(schema.championTiers.role, role));
	if (patch) filters.push(eq(schema.championTiers.patch, patch));

	const where = filters.length > 0 ? and(...filters) : undefined;
	const rows = await db.select().from(schema.championTiers).where(where).all();

	return c.json(v.parse(TierListSchema, rows));
});
