import { Component, Element, Event, EventEmitter, Prop, State, h } from "@stencil/core";

import type { MatchEntry, PlayerChampionEntry, PlayerSummary } from "../../data/mock";

type SubRoute = "overview" | "champions" | "matches";

const ROUTE_TO_PATH: Record<SubRoute, string> = {
	overview: "",
	champions: "champions",
	matches: "match-history",
};

/**
 * Top-level player MFE shell. Hand-rolled sub-router (no @stencil/router) so
 * shell apps can host the component as a single custom element. Emits
 * `routechange` whenever the active sub-route updates so a host (Vike, Next,
 * etc.) can sync its own URL via history.pushState.
 */
@Component({
	tag: "rift-player-app",
	styleUrl: "rift-player-app.css",
	shadow: true,
})
export class RiftPlayerApp {
	@Element() host!: HTMLElement;

	/** Authenticated user. JSON-serializable so SSR/DSD can roundtrip it. */
	@Prop() user?: PlayerSummary;

	/** Top champions by mastery, forwarded to `<rift-player-overview>`. */
	@Prop() topMastery?: PlayerChampionEntry[];

	/** Owned champions, forwarded to `<rift-player-champions>`. */
	@Prop() ownedChampions?: PlayerChampionEntry[];

	/** Match history, forwarded to `<rift-player-matches>`. */
	@Prop() matchHistory?: MatchEntry[];

	/** Initial sub-route, used by the host to deep-link e.g. /player/match-history. */
	@Prop({ mutable: true }) initialRoute: SubRoute = "overview";

	/** Currently rendered sub-route. */
	@State() route: SubRoute = "overview";

	/** Emitted with `{ path }` so the host can update its URL. */
	@Event({ eventName: "routechange" }) routeChange!: EventEmitter<{ path: string; route: SubRoute }>;

	componentWillLoad() {
		this.route = this.initialRoute;
	}

	private readonly go = (next: SubRoute) => {
		if (next === this.route) {
			return;
		}
		this.route = next;
		this.routeChange.emit({ path: ROUTE_TO_PATH[next], route: next });
	};

	private renderTab(label: string, target: SubRoute) {
		const active = this.route === target;
		const handleClick = () => {
			this.go(target);
		};
		return (
			<button type="button" class="tab" aria-current={active ? "page" : undefined} onClick={handleClick}>
				{label}
			</button>
		);
	}

	private renderActive() {
		switch (this.route) {
			case "champions":
				return <rift-player-champions ownedChampions={this.ownedChampions}></rift-player-champions>;
			case "matches":
				return <rift-player-matches matchHistory={this.matchHistory}></rift-player-matches>;
			default:
				return <rift-player-overview user={this.user} topMastery={this.topMastery}></rift-player-overview>;
		}
	}

	render() {
		const name = this.user?.summonerName ?? "Summoner";
		const level = this.user?.summonerLevel ?? 0;
		return (
			<section class="shell" data-testid="rift-player-app">
				<header>
					<h1 class="heading">
						{name}
						<span class="muted"> · level {level}</span>
					</h1>
					<nav class="tabs" aria-label="Player sections">
						{this.renderTab("Overview", "overview")}
						{this.renderTab("Owned Champions", "champions")}
						{this.renderTab("Match History", "matches")}
					</nav>
				</header>
				<div>{this.renderActive()}</div>
			</section>
		);
	}

	// Internal helper for host integrations that prefer a method over re-setting
	// `initialRoute`. Stencil exposes @Method automatically.
	// (Defined as a public class field so docs-readme picks it up cleanly.)
}
