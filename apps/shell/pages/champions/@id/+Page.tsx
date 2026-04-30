// See `apps/shell/pages/champions/index/+Page.tsx` for the D-A.5 wiring
// rationale. Same pattern: client build rewrites to MF runtime, SSR
// build resolves to workspace via alias.
export { default } from "mfe-champions/pages/champion-detail";
