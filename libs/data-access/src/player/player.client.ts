import type { Hono } from "hono";
import { hc } from "hono/client";

// Placeholder router type — replace with the real AppType once apps/mfe-player is scaffolded.
type PlayerAppType = Hono;

export const createPlayerClient = (baseUrl: string): ReturnType<typeof hc<PlayerAppType>> => hc<PlayerAppType>(baseUrl);

export type PlayerClient = ReturnType<typeof createPlayerClient>;
