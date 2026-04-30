import * as v from "valibot";

import { ChampionRoleSchema } from "./champion-tier";

export const ChampionSchema = v.object({
	id: v.string(),
	name: v.string(),
	roles: v.array(ChampionRoleSchema),
	difficulty: v.pipe(v.number(), v.minValue(1), v.maxValue(10)),
	stats: v.record(v.string(), v.number()),
	splashArtUrl: v.string(),
	squareIconUrl: v.string(),
	lore: v.string(),
});

export type Champion = v.InferOutput<typeof ChampionSchema>;
