import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

/* ── champions ─────────────────────────────────────────────────────────── */

export const champions = sqliteTable("champions", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	roles: text("roles", { mode: "json" }).$type<string[]>().notNull(),
	difficulty: integer("difficulty").notNull(),
	stats: text("stats", { mode: "json" }).$type<Record<string, number>>().notNull(),
	splashArtUrl: text("splash_art_url").notNull(),
	squareIconUrl: text("square_icon_url").notNull(),
	lore: text("lore").notNull(),
});

export const championAbilities = sqliteTable("champion_abilities", {
	id: text("id").primaryKey(),
	championId: text("champion_id")
		.notNull()
		.references(() => champions.id, { onDelete: "cascade" }),
	slot: text("slot").notNull(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	cooldown: real("cooldown"),
});

export const championSkins = sqliteTable("champion_skins", {
	id: text("id").primaryKey(),
	championId: text("champion_id")
		.notNull()
		.references(() => champions.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	rpPrice: integer("rp_price").notNull(),
	splashArtUrl: text("splash_art_url").notNull(),
	rarity: text("rarity").notNull(),
});

export const championTiers = sqliteTable("champion_tiers", {
	id: text("id").primaryKey(),
	championId: text("champion_id")
		.notNull()
		.references(() => champions.id, { onDelete: "cascade" }),
	tier: text("tier").notNull(),
	role: text("role").notNull(),
	patch: text("patch").notNull(),
	winRate: real("win_rate").notNull(),
	pickRate: real("pick_rate").notNull(),
});

/* ── players ───────────────────────────────────────────────────────────── */

export const players = sqliteTable(
	"players",
	{
		id: text("id").primaryKey(),
		summonerName: text("summoner_name").notNull(),
		accountId: text("account_id").notNull(),
		profileIconId: integer("profile_icon_id").notNull(),
		summonerLevel: integer("summoner_level").notNull(),
		auth0Sub: text("auth0_sub").notNull(),
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.default(sql`(unixepoch())`),
	},
	t => ({
		auth0SubIdx: uniqueIndex("players_auth0_sub_idx").on(t.auth0Sub),
	}),
);

export const playerChampions = sqliteTable("player_champions", {
	playerId: text("player_id")
		.notNull()
		.references(() => players.id, { onDelete: "cascade" }),
	championId: text("champion_id")
		.notNull()
		.references(() => champions.id, { onDelete: "cascade" }),
	masteryLevel: integer("mastery_level").notNull(),
	masteryPoints: integer("mastery_points").notNull(),
	owned: integer("owned", { mode: "boolean" }).notNull(),
});

export const playerMatches = sqliteTable("player_matches", {
	id: text("id").primaryKey(),
	playerId: text("player_id")
		.notNull()
		.references(() => players.id, { onDelete: "cascade" }),
	championId: text("champion_id")
		.notNull()
		.references(() => champions.id, { onDelete: "cascade" }),
	role: text("role").notNull(),
	kills: integer("kills").notNull(),
	deaths: integer("deaths").notNull(),
	assists: integer("assists").notNull(),
	win: integer("win", { mode: "boolean" }).notNull(),
	gameDuration: integer("game_duration").notNull(),
	matchDate: text("match_date").notNull(),
});
