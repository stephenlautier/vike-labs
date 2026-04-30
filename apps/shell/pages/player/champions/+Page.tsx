import { RiftPlayerApp } from "@rift/mfe-player/react";

import { Link } from "../../../components/Link";
import { PlayerHydrator } from "../PlayerHydrator";

export default function Page() {
	return (
		<div>
			<RiftPlayerApp
				user={{ id: "guest", summonerName: "Summoner", profileIconId: 0, summonerLevel: 30 }}
				initialRoute="champions"
			/>
			<PlayerHydrator />
			<p style={{ marginTop: "1rem", fontSize: "0.75rem", color: "rgb(161 161 170)" }}>
				Cross-MFE link: <Link href="/champions">browse champions →</Link>
			</p>
		</div>
	);
}
