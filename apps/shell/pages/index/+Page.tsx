export default function Page() {
	return (
		<div>
			<h1 className="text-3xl font-bold mb-4">Welcome to Rift</h1>
			<p className="text-muted-foreground mb-6">Your League of Legends companion app.</p>
			<nav className="flex flex-col gap-2">
				<a href="/champions" className="underline">
					Browse Champions
				</a>
				<a href="/tier-list" className="underline">
					View Tier List
				</a>
				<a href="/player" className="underline">
					My Profile
				</a>
			</nav>
		</div>
	);
}
