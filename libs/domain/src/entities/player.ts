import * as v from "valibot";

// TODO: fill in all fields per AGENTS.md domain model
export const PlayerSchema = v.object({
	id: v.string(),
	summonerName: v.string(),
	accountId: v.string(),
	profileIconId: v.number(),
	summonerLevel: v.number(),
	auth0Sub: v.string(),
});

export type Player = v.InferOutput<typeof PlayerSchema>;
