import type { Config } from "vike/types";
import vikeReact from "vike-react/config";

const config: Config = {
  title: "Rift — League of Legends",
  description: "League of Legends companion app",
  passToClient: ["user"],
  extends: [vikeReact],
  ssr: true,
};

export default config;
