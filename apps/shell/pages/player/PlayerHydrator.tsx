import { fetchPlayerSummary } from "@rift/data-access";
import { useEffect } from "react";

/**
 * Client-only side-effect component:
 * 1. Registers the `<rift-player-*>` custom elements.
 * 2. Fetches the live player summary from `@rift/api` and assigns it as
 *    properties on the `<rift-player-app>` instance, replacing the SSR
 *    skeleton (mock fallback) with real per-user data.
 *
 * The dynamic `import()` keeps the loader and fetch out of the SSR bundle.
 */
export function PlayerHydrator() {
	useEffect(() => {
		let cancelled = false;
		void (async () => {
			await import("@rift/mfe-player/loader");
			let summary;
			try {
				summary = await fetchPlayerSummary("");
			} catch (error) {
				// Unauthenticated / network error → leave SSR mock placeholder visible.
				console.warn("[PlayerHydrator] fetchPlayerSummary failed", error);
				return;
			}
			if (cancelled) return;
			const el = document.querySelector("rift-player-app") as
				| (HTMLElement & {
						user?: unknown;
						topMastery?: unknown;
						ownedChampions?: unknown;
						matchHistory?: unknown;
				  })
				| null;
			if (!el) return;
			el.user = summary.user;
			el.topMastery = summary.topMastery;
			el.ownedChampions = summary.ownedChampions;
			el.matchHistory = summary.matches;
		})();
		return () => {
			cancelled = true;
		};
	}, []);
	return null;
}
