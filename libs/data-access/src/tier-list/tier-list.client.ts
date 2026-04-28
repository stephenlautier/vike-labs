import type { Hono } from "hono";
import { hc } from "hono/client";

// Placeholder router type — replace with the real AppType once apps/mfe-tier-list is scaffolded.
type TierListAppType = Hono;

export const createTierListClient = (baseUrl: string): ReturnType<typeof hc<TierListAppType>> =>
	hc<TierListAppType>(baseUrl);

export type TierListClient = ReturnType<typeof createTierListClient>;
