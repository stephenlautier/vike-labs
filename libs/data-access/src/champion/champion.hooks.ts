import type { Champion, ChampionAbility, ChampionSkin } from "@rift/champion";

export type UseChampionsResult = {
	data: Champion[] | null;
	isLoading: boolean;
	error: Error | null;
};

export type UseChampionResult = {
	data: Champion | null;
	abilities: ChampionAbility[] | null;
	skins: ChampionSkin[] | null;
	isLoading: boolean;
	error: Error | null;
};

// Stub — implement with ChampionsClient once apps/mfe-champions is scaffolded.
export const useChampions = (): UseChampionsResult => ({
	data: null,
	isLoading: false,
	error: null,
});

// Stub — implement with ChampionsClient once apps/mfe-champions is scaffolded.
export const useChampion = (_id: string): UseChampionResult => ({
	data: null,
	abilities: null,
	skins: null,
	isLoading: false,
	error: null,
});
