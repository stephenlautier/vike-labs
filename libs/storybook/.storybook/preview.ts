// Lazily registers all lol-* web components in the browser.
// Requires `pnpm nx run ui:build` to have run first (loader/ is a build artifact).
import { defineCustomElements } from "@rift/ui/loader";

defineCustomElements();
