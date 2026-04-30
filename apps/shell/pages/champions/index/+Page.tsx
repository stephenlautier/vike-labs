// D-A.5 — runtime federation. The bare-name `mfe-champions` re-export is
// rewritten on the **client** build by `@module-federation/vite` into a
// `loadRemote("mfe-champions/pages/champions-list")` call so the page
// chunk is fetched from the remote's `mf-manifest.json` at runtime.
//
// On the **SSR** build the federation plugin is disabled (see
// `apps/shell/vite.config.ts`) and the bare name resolves via the
// `mfe-champions/pages/champions-list` alias to the MFE source — keeping
// Vike SSR + per-route `data()` execution intact.
export { default } from "mfe-champions/pages/champions-list";
