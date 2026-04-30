import type { JSX } from "react";
import "./tailwind.css";
import { usePageContext } from "vike-react/usePageContext";

import { Link } from "../components/Link";
import { SignOutButton } from "../components/SignOutButton";
import { ThemeProvider } from "../components/ThemeProvider";
import { ThemeSwitcher } from "../components/ThemeSwitcher";

export default function Layout({ children }: { children: React.ReactNode }): JSX.Element {
	const pageContext = usePageContext();
	return (
		<ThemeProvider initialMode={pageContext.theme ?? "system"}>
			<div className="min-h-screen flex flex-col">
				<Nav />
				<main className="flex-1 container mx-auto px-4 py-8">{children}</main>
			</div>
		</ThemeProvider>
	);
}

function Nav(): JSX.Element {
	const pageContext = usePageContext();
	const session = pageContext.session;
	const player = pageContext.player;
	const displayName = player?.summonerName ?? session?.user?.name ?? null;

	return (
		<header className="border-b border-border bg-background sticky top-0 z-10">
			<div className="container mx-auto px-4 h-14 flex items-center justify-between">
				<Link href="/">Rift</Link>
				<nav className="flex items-center gap-6 text-sm">
					<Link href="/champions">Champions</Link>
					<Link href="/tier-list">Tier List</Link>
					<Link href="/player">My Profile</Link>
				</nav>
				<div className="flex items-center gap-4 text-sm">
					<ThemeSwitcher />
					{displayName ? (
						<span className="flex items-center gap-2">
							<span>{displayName}</span>
							<span className="text-muted-foreground">·</span>
							<SignOutButton />
						</span>
					) : (
						<a href="/login">Sign in</a>
					)}
				</div>
			</div>
		</header>
	);
}
