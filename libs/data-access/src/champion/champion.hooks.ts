import type { Champion, ChampionAbility, ChampionSkin } from "@rift/champion";
import { useEffect, useState } from "react";

import { createApiClient } from "../api-client";

export type UseChampionsResult = {
	data: Champion[] | null;
	isLoading: boolean;
	error: Error | null;
};

export type UseChampionResult = {
	data: Champion | null;
	abilities: ChampionAbility[] | null;
	skins: ChampionSkin[] | null;
	isLoading: boolean;
	error: Error | null;
};

/**
 * `baseUrl` defaults to `""` so calls hit the same origin (the per-MFE
 * Vite/Hono dev server proxies `/api/*` to the standalone `@rift/api`).
 */
export const useChampions = (baseUrl = ""): UseChampionsResult => {
	const [data, setData] = useState<Champion[] | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [fetchError, setFetchError] = useState<Error | null>(null);

	useEffect(() => {
		let cancelled = false;
		const client = createApiClient(`${baseUrl}/api`);
		setIsLoading(true);
		client.champions
			.$get()
			.then(async res => {
				if (!res.ok) {
					throw new Error(`HTTP ${res.status}`);
				}
				return res.json();
			})
			.then(json => {
				if (cancelled) {
					return;
				}
				setData(json);
				setIsLoading(false);
			})
			.catch((error: unknown) => {
				if (cancelled) {
					return;
				}
				setFetchError(error instanceof Error ? error : new Error(String(error)));
				setIsLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [baseUrl]);

	return { data, isLoading, error: fetchError };
};

export const useChampion = (id: string, baseUrl = ""): UseChampionResult => {
	const [data, setData] = useState<Champion | null>(null);
	const [abilities, setAbilities] = useState<ChampionAbility[] | null>(null);
	const [skins, setSkins] = useState<ChampionSkin[] | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [fetchError, setFetchError] = useState<Error | null>(null);

	useEffect(() => {
		if (!id) {
			return;
		}
		let cancelled = false;
		const client = createApiClient(`${baseUrl}/api`);
		setIsLoading(true);
		client.champions[":id"]
			.$get({ param: { id } })
			.then(async res => {
				if (!res.ok) {
					throw new Error(`HTTP ${res.status}`);
				}
				return res.json();
			})
			.then(({ champion, abilities: ab, skins: sk }) => {
				if (cancelled) {
					return;
				}
				setData(champion);
				setAbilities(ab);
				setSkins(sk);
				setIsLoading(false);
			})
			.catch((error: unknown) => {
				if (cancelled) {
					return;
				}
				setFetchError(error instanceof Error ? error : new Error(String(error)));
				setIsLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [id, baseUrl]);

	return { data, abilities, skins, isLoading, error: fetchError };
};
