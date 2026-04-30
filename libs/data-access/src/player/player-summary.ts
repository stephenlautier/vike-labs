import type { Champion } from "@rift/champion";
import type { Player, PlayerChampion, PlayerMatchEntry } from "@rift/player";

import { createApiClient } from "../api-client";

/**
 * Denormalized view of a player tuned for the `<rift-player-app>` Stencil
 * component. Champion names are resolved against the champions catalogue so
 * the web component can render without further lookups (it has no React /
 * hook context).
 */
export interface PlayerSummary {
	user: PlayerSummaryUser;
	topMastery: PlayerSummaryChampion[];
	ownedChampions: PlayerSummaryChampion[];
	matches: PlayerSummaryMatch[];
}

export interface PlayerSummaryUser {
	id: string;
	summonerName: string;
	profileIconId: number;
	summonerLevel: number;
}

export interface PlayerSummaryChampion {
	championId: string;
	championName: string;
	masteryLevel: number;
	masteryPoints: number;
	owned: boolean;
}

export interface PlayerSummaryMatch {
	id: string;
	championId: string;
	championName: string;
	role: PlayerMatchEntry["role"];
	kills: number;
	deaths: number;
	assists: number;
	win: boolean;
	gameDurationSec: number;
	matchDate: string;
}

/**
 * Framework-agnostic player fetch. Returns a fully denormalized
 * `PlayerSummary` ready to be assigned to the `<rift-player-app>` custom
 * element's properties.
 *
 * Pass an empty `baseUrl` in the browser when `/api/*` is proxied; pass an
 * absolute URL on the server (Vike `+data.ts`).
 */
export async function fetchPlayerSummary(baseUrl: string): Promise<PlayerSummary> {
	const client = createApiClient(`${baseUrl}/api`);

	const [playerRes, championsRes, playerChampionsRes, matchesRes] = await Promise.all([
		client.player.me.$get(),
		client.champions.$get(),
		client.player.me.champions.$get(),
		client.player.me.matches.$get(),
	]);

	if (!playerRes.ok) throw new Error(`player/me HTTP ${playerRes.status}`);
	if (!championsRes.ok) throw new Error(`champions HTTP ${championsRes.status}`);
	if (!playerChampionsRes.ok) throw new Error(`player/me/champions HTTP ${playerChampionsRes.status}`);
	if (!matchesRes.ok) throw new Error(`player/me/matches HTTP ${matchesRes.status}`);

	const [player, champions, playerChampions, matches] = await Promise.all([
		playerRes.json() as Promise<Player>,
		championsRes.json() as Promise<Champion[]>,
		playerChampionsRes.json() as Promise<PlayerChampion[]>,
		matchesRes.json() as Promise<PlayerMatchEntry[]>,
	]);

	const nameById = new Map(champions.map(c => [c.id, c.name]));
	const resolveName = (championId: string) => nameById.get(championId) ?? championId;

	const ownedChampions: PlayerSummaryChampion[] = playerChampions.map(pc => ({
		championId: pc.championId,
		championName: resolveName(pc.championId),
		masteryLevel: pc.masteryLevel,
		masteryPoints: pc.masteryPoints,
		owned: pc.owned,
	}));

	const topMastery = [...ownedChampions].sort((a, b) => b.masteryPoints - a.masteryPoints).slice(0, 3);

	const summaryMatches: PlayerSummaryMatch[] = matches.map(m => ({
		id: m.id,
		championId: m.championId,
		championName: resolveName(m.championId),
		role: m.role,
		kills: m.kills,
		deaths: m.deaths,
		assists: m.assists,
		win: m.win,
		gameDurationSec: m.gameDuration,
		matchDate: m.matchDate,
	}));

	return {
		user: {
			id: player.id,
			summonerName: player.summonerName,
			profileIconId: player.profileIconId,
			summonerLevel: player.summonerLevel,
		},
		topMastery,
		ownedChampions,
		matches: summaryMatches,
	};
}
