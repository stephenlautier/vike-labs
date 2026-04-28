import type { Player, PlayerChampion, PlayerMatchEntry } from "@rift/player";

export type UsePlayerResult = {
	data: Player | null;
	isLoading: boolean;
	error: Error | null;
};

export type UsePlayerChampionsResult = {
	data: PlayerChampion[] | null;
	isLoading: boolean;
	error: Error | null;
};

export type UseMatchHistoryResult = {
	data: PlayerMatchEntry[] | null;
	isLoading: boolean;
	error: Error | null;
};

// Stub — implement with PlayerClient once apps/mfe-player is scaffolded.
export const usePlayer = (): UsePlayerResult => ({ data: null, isLoading: false, error: null });

// Stub — implement with PlayerClient once apps/mfe-player is scaffolded.
export const usePlayerChampions = (): UsePlayerChampionsResult => ({
	data: null,
	isLoading: false,
	error: null,
});

// Stub — implement with PlayerClient once apps/mfe-player is scaffolded.
export const useMatchHistory = (): UseMatchHistoryResult => ({ data: null, isLoading: false, error: null });
