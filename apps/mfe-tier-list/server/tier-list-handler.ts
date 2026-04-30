import type { Champion, ChampionRole, ChampionTier, Tier } from "@rift/champion";
import { SEED_CHAMPIONS, SEED_TIERS } from "@rift/champion";
import type { Hono } from "hono";

export type EnrichedTierEntry = ChampionTier & {
	champion: Pick<Champion, "id" | "name" | "splashArtUrl" | "squareIconUrl" | "roles">;
};

export function buildEnrichedTiers(tierFilter?: Tier, roleFilter?: ChampionRole, patch?: string): EnrichedTierEntry[] {
	let entries = SEED_TIERS;

	if (tierFilter) {
		entries = entries.filter(e => e.tier === tierFilter);
	}
	if (roleFilter) {
		entries = entries.filter(e => e.role === roleFilter);
	}
	if (patch) {
		entries = entries.filter(e => e.patch === patch);
	}

	return entries.flatMap(entry => {
		const champion = SEED_CHAMPIONS.find(c => c.id === entry.championId);
		if (!champion) {
			return [];
		}
		return [
			{
				...entry,
				champion: {
					id: champion.id,
					name: champion.name,
					splashArtUrl: champion.splashArtUrl,
					squareIconUrl: champion.squareIconUrl,
					roles: champion.roles,
				},
			},
		];
	});
}

export function registerTierListRoutes(app: Hono): void {
	app.get("/api/tier-list", c => {
		const tier = c.req.query("tier") as Tier | undefined;
		const role = c.req.query("role") as ChampionRole | undefined;
		const patch = c.req.query("patch");
		return c.json(buildEnrichedTiers(tier, role, patch));
	});
}
