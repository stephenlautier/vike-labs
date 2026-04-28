import { Component, h, Prop } from "@stencil/core";

/**
 * Displays a League of Legends champion card with name and splash art.
 * Stub — logic to be implemented in a later phase.
 */
@Component({
	tag: "lol-champion-card",
	styleUrl: "lol-champion-card.css",
	shadow: true,
})
export class LolChampionCard {
	/** Champion name */
	@Prop() name: string = "";

	/** URL to the champion splash art */
	@Prop() splashArtUrl: string = "";

	render() {
		return (
			<div class="champion-card">
				<slot />
			</div>
		);
	}
}
