import { Component, h } from "@stencil/core";

import { MOCK_MATCH_HISTORY, formatDuration } from "../../data/mock";

@Component({
	tag: "rift-player-matches",
	styleUrl: "rift-player-matches.css",
	shadow: true,
})
export class RiftPlayerMatches {
	render() {
		return (
			<div>
				<h2 class="heading">Match History</h2>
				<table class="table">
					<thead>
						<tr>
							<th>Champion</th>
							<th>Role</th>
							<th>K / D / A</th>
							<th>Duration</th>
							<th>Result</th>
						</tr>
					</thead>
					<tbody>
						{MOCK_MATCH_HISTORY.map(m => (
							<tr key={m.id}>
								<td>{m.championName}</td>
								<td>{m.role}</td>
								<td>
									{m.kills} / {m.deaths} / {m.assists}
								</td>
								<td>{formatDuration(m.gameDurationSec)}</td>
								<td class={m.win ? "win" : "loss"}>{m.win ? "Win" : "Loss"}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}
}
