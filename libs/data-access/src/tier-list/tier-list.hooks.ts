import type { ChampionRole, ChampionTier, Tier } from "@rift/champion";
import { useEffect, useState } from "react";

import { createApiClient } from "../api-client";

export type TierListFilters = {
	tier?: Tier;
	role?: ChampionRole;
	patch?: string;
};

export type UseTierListResult = {
	data: ChampionTier[] | null;
	isLoading: boolean;
	error: Error | null;
};

export const useTierList = (filters: TierListFilters = {}, baseUrl = ""): UseTierListResult => {
	const [data, setData] = useState<ChampionTier[] | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [fetchError, setFetchError] = useState<Error | null>(null);

	useEffect(() => {
		let cancelled = false;
		const client = createApiClient(`${baseUrl}/api`);
		setIsLoading(true);

		client["tier-list"]
			.$get({ query: filters })
			.then(async res => {
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				return res.json();
			})
			.then(json => {
				if (cancelled) return;
				setData(json);
				setIsLoading(false);
			})
			.catch((error: unknown) => {
				if (cancelled) return;
				setFetchError(error instanceof Error ? error : new Error(String(error)));
				setIsLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [filters.tier, filters.role, filters.patch, baseUrl]);

	return { data, isLoading, error: fetchError };
};
