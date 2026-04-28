import * as v from "valibot";

// TODO: fill in all fields per AGENTS.md domain model
export const AbilitySlotSchema = v.picklist(["Q", "W", "E", "R", "P"]);
export type AbilitySlot = v.InferOutput<typeof AbilitySlotSchema>;

export const ChampionAbilitySchema = v.object({
	id: v.string(),
	slot: AbilitySlotSchema,
	name: v.string(),
	description: v.string(),
	cooldown: v.optional(v.number()),
	championId: v.string(),
});

export type ChampionAbility = v.InferOutput<typeof ChampionAbilitySchema>;
