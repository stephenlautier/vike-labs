import { RiftPlayerApp } from "@rift/mfe-player/react";

import { Link } from "../../../components/Link";
import { CROSS_MFE_LINK_STYLE, GUEST_USER } from "../constants";
import { PlayerHydrator } from "../PlayerHydrator";

export default function Page() {
	return (
		<div>
			<RiftPlayerApp user={GUEST_USER} initialRoute="champions" />
			<PlayerHydrator />
			<p style={CROSS_MFE_LINK_STYLE}>
				Cross-MFE link: <Link href="/champions">browse champions →</Link>
			</p>
		</div>
	);
}
