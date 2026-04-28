import type { Config } from "vike/types";
import vikeReact from "vike-react/config";

const config: Config = {
  title: "Player Profile — Rift",
  description: "Your League of Legends player profile",
  passToClient: ["user"],
  extends: [vikeReact],
  ssr: true,
};

export default config;
