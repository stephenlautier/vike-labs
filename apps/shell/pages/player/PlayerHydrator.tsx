import { useEffect } from "react";

/**
 * Client-only side-effect component: registers the `<rift-player-*>` custom
 * elements once mounted. Lives in a separate component so the dynamic
 * `import()` is tree-shaken from the SSR bundle and only fetched in the
 * browser. The loader self-defines all custom elements on import.
 */
export function PlayerHydrator() {
	useEffect(() => {
		void import("@rift/mfe-player/loader");
	}, []);
	return null;
}
