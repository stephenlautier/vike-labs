import * as v from "valibot";

// TODO: fill in all fields per AGENTS.md domain model
export const ChampionSchema = v.object({
	id: v.string(),
	name: v.string(),
	roles: v.array(v.string()),
	difficulty: v.pipe(v.number(), v.minValue(1), v.maxValue(10)),
	stats: v.record(v.string(), v.number()),
	splashArtUrl: v.string(),
	lore: v.string(),
});

export type Champion = v.InferOutput<typeof ChampionSchema>;
