import type { Champion, ChampionAbility, ChampionSkin } from "@rift/champion";
import { useEffect, useState } from "react";

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

export const useChampions = (baseUrl = ""): UseChampionsResult => {
	const [data, setData] = useState<Champion[] | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [fetchError, setFetchError] = useState<Error | null>(null);

	useEffect(() => {
		let cancelled = false;
		setIsLoading(true);
		fetch(`${baseUrl}/api/champions`)
			.then(res => {
				if (!res.ok) {
					throw new Error(`HTTP ${res.status}`);
				}
				return res.json() as Promise<Champion[]>;
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
	}, [baseUrl]);

	return { data, isLoading, error: fetchError };
};

type ChampionDetailResponse = Champion & { abilities: ChampionAbility[]; skins: ChampionSkin[] };

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
		setIsLoading(true);
		fetch(`${baseUrl}/api/champions/${encodeURIComponent(id)}`)
			.then(res => {
				if (!res.ok) {
					throw new Error(`HTTP ${res.status}`);
				}
				return res.json() as Promise<ChampionDetailResponse>;
			})
			.then(({ abilities: ab, skins: sk, ...champion }) => {
				if (!cancelled) {
					setData(champion);
					setAbilities(ab);
					setSkins(sk);
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
	}, [id, baseUrl]);

	return { data, abilities, skins, isLoading, error: fetchError };
};
