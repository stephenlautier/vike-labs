import { fetchPlayerSummary } from "@rift/data-access";
import { useEffect } from "react";

type SubRoute = "overview" | "champions" | "matches";

const ROUTE_TO_PATH: Record<SubRoute, string> = {
	overview: "",
	champions: "champions",
	matches: "match-history",
};

const PATH_TO_ROUTE: Record<string, SubRoute> = {
	"": "overview",
	champions: "champions",
	"match-history": "matches",
};

const subRouteFromUrl = (): SubRoute => {
	const sub = window.location.pathname.replace(/^\/player\/?/, "");
	return PATH_TO_ROUTE[sub] ?? "overview";
};

type RiftPlayerAppEl = HTMLElement & {
	user?: unknown;
	topMastery?: unknown;
	ownedChampions?: unknown;
	matchHistory?: unknown;
	initialRoute?: SubRoute;
	setActiveRoute?: (route: SubRoute) => Promise<void>;
};

/**
 * Client-only side-effect component:
 * 1. Registers the `<rift-player-*>` custom elements.
 * 2. Fetches the live player summary from `@rift/api` and assigns it as
 *    properties on the `<rift-player-app>` instance, replacing the SSR
 *    skeleton (mock fallback) with real per-user data.
 * 3. Bridges the Stencil `routechange` event ↔ browser History so tab clicks
 *    inside `<rift-player-app>` update the URL (no Vike round-trip per the
 *    architecture plan), and back/forward navigation updates the active tab.
 */
export function PlayerHydrator() {
	useEffect(() => {
		let cancelled = false;
		const cleanups: Array<() => void> = [];

		void (async () => {
			await import("@rift/mfe-player/loader");
			if (cancelled) return;

			const el = document.querySelector<RiftPlayerAppEl>("rift-player-app");
			if (!el) return;

			// 1. Forward Stencil routechange → history.pushState (no Vike round-trip).
			const onRouteChange = (event: Event) => {
				const detail = (event as CustomEvent<{ path: string; route: SubRoute }>).detail;
				const next = `/player${detail.path ? `/${detail.path}` : ""}`;
				if (next !== window.location.pathname) {
					window.history.pushState({ riftPlayer: detail.route }, "", next);
				}
			};
			el.addEventListener("routechange", onRouteChange);
			cleanups.push(() => el.removeEventListener("routechange", onRouteChange));

			// 2. Browser back/forward → update the active tab via imperative method.
			//    `setActiveRoute` (Stencil @Method) syncs internal state even when
			//    the `initialRoute` prop value hasn't changed.
			const onPopState = () => {
				void el.setActiveRoute?.(subRouteFromUrl());
			};
			window.addEventListener("popstate", onPopState);
			cleanups.push(() => window.removeEventListener("popstate", onPopState));

			// 3. Fetch live data and hydrate props.
			let summary;
			try {
				summary = await fetchPlayerSummary("");
			} catch (error) {
				// Unauthenticated / network error → leave SSR mock placeholder visible.
				console.warn("[PlayerHydrator] fetchPlayerSummary failed", error);
				return;
			}
			if (cancelled) return;
			el.user = summary.user;
			el.topMastery = summary.topMastery;
			el.ownedChampions = summary.ownedChampions;
			el.matchHistory = summary.matches;
		})();

		return () => {
			cancelled = true;
			for (const fn of cleanups) fn();
		};
	}, []);
	return null;
}

// Exported for tests / shell-internal reuse.
export const playerRoutePath = (route: SubRoute): string =>
	`/player${ROUTE_TO_PATH[route] ? `/${ROUTE_TO_PATH[route]}` : ""}`;
