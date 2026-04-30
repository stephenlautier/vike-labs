import { Component, Prop, h } from "@stencil/core";

import { MOCK_TOP_MASTERY, formatPoints } from "../../data/mock";
import type { PlayerSummary } from "../../data/mock";

@Component({
	tag: "rift-player-overview",
	styleUrl: "rift-player-overview.css",
	shadow: true,
})
export class RiftPlayerOverview {
	@Prop() user?: PlayerSummary;

	render() {
		return (
			<div>
				<h2 class="heading">
					Top 3 Champions <span class="muted">by mastery</span>
				</h2>
				<div class="wrap">
					{MOCK_TOP_MASTERY.map(c => (
						<article class="card" key={c.championId}>
							<div class="name">{c.championName}</div>
							<div class="points">{formatPoints(c.masteryPoints)}</div>
							<div class="mastery">Mastery {c.masteryLevel}</div>
						</article>
					))}
				</div>
				{this.user ? null : (
					<p class="muted" style={{ marginTop: "1rem" }}>
						Sign in for personalised stats.
					</p>
				)}
			</div>
		);
	}
}
