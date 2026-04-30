import { RiftPlayerApp } from "@rift/mfe-player/react";

import { Link } from "../../components/Link";
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
			<RiftPlayerApp
				user={{ id: "guest", summonerName: "Summoner", profileIconId: 0, summonerLevel: 30 }}
				initialRoute="overview"
			/>
			<PlayerHydrator />
			<p style={{ marginTop: "1rem", fontSize: "0.75rem", color: "rgb(161 161 170)" }}>
				Cross-MFE link: <Link href="/champions">browse champions →</Link>
			</p>
		</div>
	);
}
