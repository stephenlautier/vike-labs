import type { Hono } from "hono";
import { hc } from "hono/client";

// Placeholder router type — replace with the real AppType once apps/mfe-champions is scaffolded.
type ChampionsAppType = Hono;

export const createChampionsClient = (baseUrl: string): ReturnType<typeof hc<ChampionsAppType>> =>
	hc<ChampionsAppType>(baseUrl);

export type ChampionsClient = ReturnType<typeof createChampionsClient>;
