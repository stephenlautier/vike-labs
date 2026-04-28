// ── Champion ────────────────────────────────────────────────────────────────
export { createChampionsClient } from "./champion/champion.client";
export type { ChampionsClient } from "./champion/champion.client";

export { useChampion, useChampions } from "./champion/champion.hooks";
export type { UseChampionResult, UseChampionsResult } from "./champion/champion.hooks";

// ── Tier List ────────────────────────────────────────────────────────────────
export { createTierListClient } from "./tier-list/tier-list.client";
export type { TierListClient } from "./tier-list/tier-list.client";

export { useTierList } from "./tier-list/tier-list.hooks";
export type { TierListFilters, UseTierListResult } from "./tier-list/tier-list.hooks";

// ── Player ───────────────────────────────────────────────────────────────────
export { createPlayerClient } from "./player/player.client";
export type { PlayerClient } from "./player/player.client";

export { useMatchHistory, usePlayer, usePlayerChampions } from "./player/player.hooks";
export type { UseMatchHistoryResult, UsePlayerChampionsResult, UsePlayerResult } from "./player/player.hooks";
