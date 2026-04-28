import vikeReact from "vike-react/config";
import type { Config } from "vike/types";

const config: Config = {
	title: "Tier List — Rift",
	description: "League of Legends champion tier list",
	extends: [vikeReact],
	ssr: true,
};

export default config;
