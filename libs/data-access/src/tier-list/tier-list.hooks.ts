import type { ChampionRole, ChampionTier, Tier } from "@rift/champion";

export type TierListFilters = {
	tier?: Tier;
	role?: ChampionRole;
	patch?: string;
};

export type UseTierListResult = {
	data: ChampionTier[] | null;
	isLoading: boolean;
	error: Error | null;
};

// Stub — implement with TierListClient once apps/mfe-tier-list is scaffolded.
export const useTierList = (_filters?: TierListFilters): UseTierListResult => ({
	data: null,
	isLoading: false,
	error: null,
});
