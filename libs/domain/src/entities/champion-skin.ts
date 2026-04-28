import * as v from "valibot";

// TODO: fill in all fields per AGENTS.md domain model
export const SkinRaritySchema = v.picklist(["common", "epic", "legendary", "ultimate", "mythic"]);
export type SkinRarity = v.InferOutput<typeof SkinRaritySchema>;

export const ChampionSkinSchema = v.object({
	id: v.string(),
	championId: v.string(),
	name: v.string(),
	rpPrice: v.number(),
	splashArtUrl: v.string(),
	rarity: SkinRaritySchema,
});

export type ChampionSkin = v.InferOutput<typeof ChampionSkinSchema>;
