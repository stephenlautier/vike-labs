import * as v from "valibot";

// TODO: fill in all fields per AGENTS.md domain model
export const PlayerChampionSchema = v.object({
	playerId: v.string(),
	championId: v.string(),
	masteryLevel: v.pipe(v.number(), v.minValue(1), v.maxValue(7)),
	masteryPoints: v.number(),
	owned: v.boolean(),
});

export type PlayerChampion = v.InferOutput<typeof PlayerChampionSchema>;
