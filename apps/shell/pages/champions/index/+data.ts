// `data` runs only on the server (during SSR or client navigation request to
// the Vike server). The shell's SSR build resolves the bare-name `mfe-*`
// alias to the MFE source files (see `apps/shell/vite.config.ts`), so this
// re-export pulls in the workspace module — federation runtime is not
// involved on the server.
export { data } from "mfe-champions/pages/champions-list/data";
