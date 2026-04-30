import { fetchPlayerSummary } from "@rift/data-access";
import type { PlayerSummary } from "@rift/data-access";
import type { PageContextServer } from "vike/types";

const API_URL = process.env.RIFT_API_URL ?? "http://localhost:3100";

export type HomeData = { signedIn: false } | { signedIn: true; summary: PlayerSummary };

/**
 * Server-side loader for the home page. When the visitor is signed in we
 * pre-fetch the player summary (top mastery + recent matches) so the
 * dashboard renders without a client-side spinner. When signed-out we ship
 * nothing — the marketing variant is purely static.
 */
export async function data(pageContext: PageContextServer): Promise<HomeData> {
	if (!pageContext.session?.user) {
		return { signedIn: false };
	}
	try {
		const summary = await fetchPlayerSummary(API_URL);
		return { signedIn: true, summary };
	} catch (error) {
		console.warn("home/+data failed to load player summary:", error);
		return { signedIn: false };
	}
}
