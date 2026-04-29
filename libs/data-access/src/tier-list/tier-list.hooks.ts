import type { ChampionRole, ChampionTier, Tier } from "@rift/champion";
import { useEffect, useState } from "react";

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
		setIsLoading(true);

		const params = new URLSearchParams();
		if (filters.tier) {
			params.set("tier", filters.tier);
		}
		if (filters.role) {
			params.set("role", filters.role);
		}
		if (filters.patch) {
			params.set("patch", filters.patch);
		}
		const query = params.toString();

		fetch(`${baseUrl}/api/tier-list${query ? `?${query}` : ""}`)
			.then(res => {
				if (!res.ok) {
					throw new Error(`HTTP ${res.status}`);
				}
				return res.json() as Promise<ChampionTier[]>;
			})
			.then(json => {
				if (!cancelled) {
					setData(json);
					setIsLoading(false);
				}
			})
			.catch((error: unknown) => {
				if (!cancelled) {
					setFetchError(error instanceof Error ? error : new Error(String(error)));
					setIsLoading(false);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [filters.tier, filters.role, filters.patch, baseUrl]);

	return { data, isLoading, error: fetchError };
};
