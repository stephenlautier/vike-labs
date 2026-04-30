/**
 * Seed the SQLite database with workspace data.
 *
 * Champions/abilities/skins/tiers come from `@rift/champion` (`SEED_*`
 * exports). A single sample player + match history is inserted with a
 * fixed `subjectId` so the local Credentials provider can resolve to it.
 *
 * Run with: `pnpm nx run api:db:seed`
 */
import { SEED_ABILITIES, SEED_CHAMPIONS, SEED_SKINS, SEED_TIERS } from "@rift/champion";

import { db, schema } from "./client";

const SAMPLE_PLAYER = {
	id: "player-1",
	summonerName: "chikohex",
	accountId: "acc-rift-demo",
	profileIconId: 4567,
	summonerLevel: 247,
	subjectId: "rift-demo",
};

async function seed(): Promise<void> {
	console.log("Clearing tables…");
	db.delete(schema.playerMatches).run();
	db.delete(schema.playerChampions).run();
	db.delete(schema.players).run();
	db.delete(schema.championTiers).run();
	db.delete(schema.championSkins).run();
	db.delete(schema.championAbilities).run();
	db.delete(schema.champions).run();

	console.log(`Inserting ${SEED_CHAMPIONS.length} champions…`);
	db.insert(schema.champions).values(SEED_CHAMPIONS).run();

	if (SEED_ABILITIES.length > 0) {
		console.log(`Inserting ${SEED_ABILITIES.length} abilities…`);
		db.insert(schema.championAbilities)
			.values(SEED_ABILITIES.map(a => ({ ...a, cooldown: a.cooldown ?? null })))
			.run();
	}

	if (SEED_SKINS.length > 0) {
		console.log(`Inserting ${SEED_SKINS.length} skins…`);
		db.insert(schema.championSkins).values(SEED_SKINS).run();
	}

	if (SEED_TIERS.length > 0) {
		console.log(`Inserting ${SEED_TIERS.length} tier entries…`);
		db.insert(schema.championTiers).values(SEED_TIERS).run();
	}

	console.log("Inserting sample player…");
	db.insert(schema.players).values(SAMPLE_PLAYER).run();

	const ownedSample = SEED_CHAMPIONS.slice(0, 6).map((c, i) => ({
		playerId: SAMPLE_PLAYER.id,
		championId: c.id,
		masteryLevel: ((i % 7) + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7,
		masteryPoints: 50_000 - i * 6000,
		owned: true,
	}));
	db.insert(schema.playerChampions).values(ownedSample).run();

	const sampleMatches = SEED_CHAMPIONS.slice(0, 5).map((c, i) => {
		const role = c.roles[0] ?? "Mid";
		return {
			id: `match-${i + 1}`,
			playerId: SAMPLE_PLAYER.id,
			championId: c.id,
			role,
			kills: 4 + i,
			deaths: 2 + (i % 3),
			assists: 6 + i,
			win: i % 2 === 0,
			gameDuration: 1500 + i * 120,
			matchDate: new Date(Date.now() - (i + 1) * 86_400_000).toISOString(),
		};
	});
	db.insert(schema.playerMatches).values(sampleMatches).run();

	console.log("Seed complete.");
}

try {
	await seed();
} catch (error) {
	console.error(error);
	process.exit(1);
}
