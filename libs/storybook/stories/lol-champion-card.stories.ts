import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

type LolChampionCardArgs = {
	name: string;
	splashArtUrl: string;
};

const meta: Meta<LolChampionCardArgs> = {
	title: "Components/LolChampionCard",
	component: "lol-champion-card",
	argTypes: {
		name: { control: "text" },
		splashArtUrl: { control: "text" },
	},
};

export default meta;

type Story = StoryObj<LolChampionCardArgs>;

export const Default: Story = {
	render: ({ name, splashArtUrl }) =>
		html`<lol-champion-card name=${name} .splashArtUrl=${splashArtUrl}></lol-champion-card>`,
	args: {
		name: "Ahri",
		splashArtUrl:
			"https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg",
	},
};
