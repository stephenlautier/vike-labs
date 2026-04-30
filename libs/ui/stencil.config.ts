import { Config } from "@stencil/core";
import { reactOutputTarget } from "@stencil/react-output-target";

export const config: Config = {
	namespace: "rift-ui",
	outputTargets: [
		reactOutputTarget({
			outDir: "src/react",
			// Tell the React wrapper how to reach the SSR hydrate module so the
			// generated wrappers serialise declarative shadow DOM during SSR
			// (instead of eagerly invoking `customElements.define` on the
			// server, which would crash). The shell wires the same module into
			// its `+onRenderHtml.ts` to post-process the rendered HTML.
			//
			// `clientModule` is the browser-side custom-elements bundle the
			// React wrappers import to register lazily on hydration; required
			// alongside `hydrateModule`.
			clientModule: "@rift/ui/dist/components",
			hydrateModule: "@rift/ui/hydrate",
		}),
		{
			type: "dist",
			esmLoaderPath: "../loader",
		},
		{
			type: "dist-custom-elements",
			customElementsExportBehavior: "auto-define-custom-elements",
			externalRuntime: false,
		},
		{
			type: "dist-hydrate-script",
			dir: "hydrate",
		},
		{
			type: "docs-readme",
		},
		{
			type: "www",
			serviceWorker: null,
		},
	],
};
