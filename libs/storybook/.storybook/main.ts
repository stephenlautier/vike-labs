import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
	stories: ["../stories/**/*.stories.@(js|jsx|ts|tsx)"],
	addons: [],
	framework: {
		name: "@storybook/web-components-vite",
		options: {},
	},
};

export default config;
