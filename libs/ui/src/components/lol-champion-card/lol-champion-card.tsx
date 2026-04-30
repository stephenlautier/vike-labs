import { Component, h, Prop } from "@stencil/core";

/**
 * Displays a League of Legends champion card with splash art, name, roles and difficulty.
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

	/** Comma-separated list of roles (e.g. "Mid,Support") */
	@Prop() roles: string = "";

	/** Difficulty rating 1–10 */
	@Prop() difficulty: number = 1;

	render() {
		const roleList = this.roles
			? this.roles
					.split(",")
					.map(r => r.trim())
					.filter(Boolean)
			: [];
		const difficultyPips = Array.from({ length: 10 }, (_, i) => i < this.difficulty);

		return (
			<div class="champion-card">
				{this.splashArtUrl && <img class="splash" src={this.splashArtUrl} alt={this.name} loading="lazy" />}
				<div class="overlay">
					<span class="name">{this.name}</span>
					{roleList.length > 0 && (
						<div class="roles">
							{roleList.map(role => (
								<span class="role-pill" key={role}>
									{role}
								</span>
							))}
						</div>
					)}
					<div class="difficulty" aria-label={`Difficulty ${this.difficulty} of 10`}>
						{difficultyPips.map((active, i) => (
							// oxlint-disable-next-line react/no-array-index-key -- fixed-position immutable pip array; index IS the stable identity
							<span class={`pip ${active ? "pip--active" : ""}`} key={i} />
						))}
					</div>
				</div>
				<slot />
			</div>
		);
	}
}
