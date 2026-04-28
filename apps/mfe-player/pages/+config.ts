import vikeReact from "vike-react/config";
import type { Config } from "vike/types";

const config: Config = {
	title: "Player Profile — Rift",
	description: "Your League of Legends player profile",
	passToClient: ["user"],
	extends: [vikeReact],
	ssr: true,
};

export default config;
