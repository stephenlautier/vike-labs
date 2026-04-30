import { fetchPlayerSummary } from "@rift/data-access";
import { useEffect } from "react";

type SubRoute = "overview" | "champions" | "matches";

const PATH_TO_ROUTE: Record<string, SubRoute> = {
	"": "overview",
	champions: "champions",
	"match-history": "matches",
};

const subRouteFromUrl = (): SubRoute => {
	const sub = globalThis.location.pathname.replace(/^\/player\/?/, "");
	return PATH_TO_ROUTE[sub] ?? "overview";
};

type RouteChangeDetail = { path: string; route: SubRoute };

const isRouteChangeEvent = (event: Event): event is CustomEvent<RouteChangeDetail> =>
	"detail" in event && typeof event.detail === "object" && event.detail !== null;

const onRouteChange: EventListener = event => {
	if (!isRouteChangeEvent(event)) {
		return;
	}
	const { detail } = event;
	const next = `/player${detail.path ? `/${detail.path}` : ""}`;
	if (next !== globalThis.location.pathname) {
		globalThis.history.pushState({ riftPlayer: detail.route }, "", next);
	}
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
export function PlayerHydrator(): null {
	useEffect(() => {
		let cancelled = false;
		const cleanups: (() => void)[] = [];

		// oxlint-disable-next-line no-void
		void (async () => {
			await import("@rift/mfe-player/loader");
			if (cancelled) {
				return;
			}

			const el = document.querySelector<RiftPlayerAppEl>("rift-player-app");
			if (!el) {
				return;
			}

			// 1. Forward Stencil routechange → history.pushState (no Vike round-trip).
			el.addEventListener("routechange", onRouteChange);
			cleanups.push(() => {
				el.removeEventListener("routechange", onRouteChange);
			});

			// 2. Browser back/forward → update the active tab via imperative method.
			//    `setActiveRoute` (Stencil @Method) syncs internal state even when
			//    the `initialRoute` prop value hasn't changed.
			const onPopState = (): void => {
				el.setActiveRoute?.(subRouteFromUrl()).catch((error: unknown) => {
					console.warn("[PlayerHydrator] setActiveRoute failed", error);
				});
			};
			globalThis.addEventListener("popstate", onPopState);
			cleanups.push(() => {
				globalThis.removeEventListener("popstate", onPopState);
			});

			// 3. Fetch live data and hydrate props.
			let summary;
			try {
				summary = await fetchPlayerSummary("");
			} catch (error) {
				// Unauthenticated / network error → leave SSR mock placeholder visible.
				console.warn("[PlayerHydrator] fetchPlayerSummary failed", error);
				return;
			}
			if (cancelled) {
				return;
			}
			el.user = summary.user;
			el.topMastery = summary.topMastery;
			el.ownedChampions = summary.ownedChampions;
			el.matchHistory = summary.matches;
		})();

		return () => {
			cancelled = true;
			for (const fn of cleanups) {
				fn();
			}
		};
	}, []);
	return null;
}
