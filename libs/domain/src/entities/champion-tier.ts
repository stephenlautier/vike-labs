import * as v from "valibot";

// TODO: fill in all fields per AGENTS.md domain model
export const TierSchema = v.picklist(["S", "A", "B", "C", "D"]);
export type Tier = v.InferOutput<typeof TierSchema>;

export const ChampionRoleSchema = v.picklist(["Top", "Jungle", "Mid", "ADC", "Support"]);
export type ChampionRole = v.InferOutput<typeof ChampionRoleSchema>;

export const ChampionTierSchema = v.object({
	id: v.string(),
	championId: v.string(),
	tier: TierSchema,
	role: ChampionRoleSchema,
	patch: v.string(),
	winRate: v.number(),
	pickRate: v.number(),
});

export type ChampionTier = v.InferOutput<typeof ChampionTierSchema>;
