import { RiftPlayerApp } from "@rift/mfe-player/react";

import { Link } from "../../components/Link";
import { CROSS_MFE_LINK_STYLE, GUEST_USER } from "./constants";
import { PlayerHydrator } from "./PlayerHydrator";

/**
 * Player MFE landing page. Static literal props are required by the
 * compile-time `@stencil/ssr` plugin so it can pre-render Declarative
 * Shadow-DOM markup at build time. User identity is therefore injected
 * client-side after hydration (see `PlayerHydrator`); the props passed
 * here are SSR placeholders.
 */
export default function Page() {
	return (
		<div>
			<RiftPlayerApp user={GUEST_USER} initialRoute="overview" />
			<PlayerHydrator />
			<p style={CROSS_MFE_LINK_STYLE}>
				Cross-MFE link: <Link href="/champions">browse champions →</Link>
			</p>
		</div>
	);
}
