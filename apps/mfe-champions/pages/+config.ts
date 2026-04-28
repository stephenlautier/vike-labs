import type { Config } from "vike/types";
import vikeReact from "vike-react/config";

const config: Config = {
  title: "Champions — Rift",
  description: "Browse League of Legends champions",
  extends: [vikeReact],
  ssr: true,
};

export default config;
