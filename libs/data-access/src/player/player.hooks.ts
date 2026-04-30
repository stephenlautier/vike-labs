import type { Player, PlayerChampion, PlayerMatchEntry } from "@rift/player";
import { useEffect, useState } from "react";

import { createApiClient } from "../api-client";

type FetchState<T> = {
	data: T | null;
	isLoading: boolean;
	error: Error | null;
};

export type UsePlayerResult = FetchState<Player>;
export type UsePlayerChampionsResult = FetchState<PlayerChampion[]>;
export type UseMatchHistoryResult = FetchState<PlayerMatchEntry[]>;

function useFetchedJson<T>(load: (signal: AbortSignal) => Promise<T>, deps: unknown[]): FetchState<T> {
	const [data, setData] = useState<T | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [fetchError, setFetchError] = useState<Error | null>(null);

	useEffect(() => {
		const ctrl = new AbortController();
		setIsLoading(true);
		load(ctrl.signal)
			.then(result => {
				if (ctrl.signal.aborted) return;
				setData(result);
				setIsLoading(false);
			})
			.catch((error: unknown) => {
				if (ctrl.signal.aborted) return;
				setFetchError(error instanceof Error ? error : new Error(String(error)));
				setIsLoading(false);
			});
		return () => ctrl.abort();
		// oxlint-disable-next-line react-hooks/exhaustive-deps -- deps controlled by caller
	}, deps);

	return { data, isLoading, error: fetchError };
}

export const usePlayer = (baseUrl = ""): UsePlayerResult => {
	return useFetchedJson<Player>(async () => {
		const client = createApiClient(`${baseUrl}/api`);
		const res = await client.player.me.$get();
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		return res.json();
	}, [baseUrl]);
};

export const usePlayerChampions = (baseUrl = ""): UsePlayerChampionsResult => {
	return useFetchedJson<PlayerChampion[]>(async () => {
		const client = createApiClient(`${baseUrl}/api`);
		const res = await client.player.me.champions.$get();
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		return res.json();
	}, [baseUrl]);
};

export const useMatchHistory = (baseUrl = ""): UseMatchHistoryResult => {
	return useFetchedJson<PlayerMatchEntry[]>(async () => {
		const client = createApiClient(`${baseUrl}/api`);
		const res = await client.player.me.matches.$get();
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		return res.json();
	}, [baseUrl]);
};
