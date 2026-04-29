export default function Page() {
	return (
		<div>
			<h1 className="text-3xl font-bold mb-4">Player Profile</h1>
			<p className="text-muted-foreground">
				Your League of Legends summoner stats, champion mastery, and match history.
			</p>
			<div className="mt-6">
				<a href="/match-history" className="underline">
					View Match History
				</a>
			</div>
		</div>
	);
}
