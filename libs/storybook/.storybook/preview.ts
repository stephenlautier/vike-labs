// Registers lol-* web components in the browser.
// Requires `pnpm nx run ui:build` to have run first (dist/ is a build artifact).
import { defineCustomElement } from "@rift/ui/dist/components/lol-champion-card";

defineCustomElement();
