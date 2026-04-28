import vikeReact from "vike-react/config";
import type { Config } from "vike/types";

const config: Config = {
	title: "Champions — Rift",
	description: "Browse League of Legends champions",
	extends: [vikeReact],
	ssr: true,
};

export default config;
