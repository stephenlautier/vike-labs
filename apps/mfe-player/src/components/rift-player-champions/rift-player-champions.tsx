import { Component, h } from "@stencil/core";

import { MOCK_OWNED_CHAMPIONS, formatPoints } from "../../data/mock";

@Component({
	tag: "rift-player-champions",
	styleUrl: "rift-player-champions.css",
	shadow: true,
})
export class RiftPlayerChampions {
	render() {
		return (
			<div>
				<h2 class="heading">Owned Champions ({MOCK_OWNED_CHAMPIONS.length})</h2>
				<div class="grid">
					{MOCK_OWNED_CHAMPIONS.map(c => (
						<article class="tile" key={c.championId}>
							<span class="name">{c.championName}</span>
							<span class="meta">
								M{c.masteryLevel} · {formatPoints(c.masteryPoints)} pts
							</span>
						</article>
					))}
				</div>
			</div>
		);
	}
}
