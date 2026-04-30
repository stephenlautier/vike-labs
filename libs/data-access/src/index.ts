// ── Typed API client ────────────────────────────────────────────────────────
export { createApiClient } from "./api-client";
export type { ApiClient } from "./api-client";

// ── Champion ────────────────────────────────────────────────────────────────
export { useChampion, useChampions } from "./champion/champion.hooks";
export type { UseChampionResult, UseChampionsResult } from "./champion/champion.hooks";

// ── Tier List ────────────────────────────────────────────────────────────────
export { useTierList } from "./tier-list/tier-list.hooks";
export type { TierListFilters, UseTierListResult } from "./tier-list/tier-list.hooks";

// ── Player ───────────────────────────────────────────────────────────────────
export { useMatchHistory, usePlayer, usePlayerChampions } from "./player/player.hooks";
export type {
	UseMatchHistoryResult,
	UsePlayerChampionsResult,
	UsePlayerResult,
} from "./player/player.hooks";
