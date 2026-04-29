import { Component, h, Prop } from "@stencil/core";

/**
 * Displays a color-coded tier badge (S / A / B / C / D) for LoL champion rankings.
 */
@Component({
	tag: "lol-tier-badge",
	styleUrl: "lol-tier-badge.css",
	shadow: true,
})
export class LolTierBadge {
	/** Tier value — S, A, B, C, or D */
	@Prop() tier: "S" | "A" | "B" | "C" | "D" = "B";

	render() {
		return (
			<span class={`badge badge--${this.tier.toLowerCase()}`} aria-label={`Tier ${this.tier}`}>
				{this.tier}
			</span>
		);
	}
}
