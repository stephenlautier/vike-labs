import * as v from "valibot";

import { ChampionRoleSchema } from "@vike-labs/champion";

// TODO: fill in all fields per AGENTS.md domain model
export const PlayerMatchEntrySchema = v.object({
	id: v.string(),
	playerId: v.string(),
	championId: v.string(),
	role: ChampionRoleSchema,
	kills: v.number(),
	deaths: v.number(),
	assists: v.number(),
	win: v.boolean(),
	gameDuration: v.number(),
	matchDate: v.string(),
});

export type PlayerMatchEntry = v.InferOutput<typeof PlayerMatchEntrySchema>;
