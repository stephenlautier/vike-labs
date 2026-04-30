import type { JSX } from "react";
import "./tailwind.css";
import { usePageContext } from "vike-react/usePageContext";

import { Link } from "../components/Link";

export default function Layout({ children }: { children: React.ReactNode }): JSX.Element {
	return (
		<div className="min-h-screen flex flex-col">
			<Nav />
			<main className="flex-1 container mx-auto px-4 py-8">{children}</main>
		</div>
	);
}

function Nav(): JSX.Element {
	const pageContext = usePageContext();
	const session = pageContext.session;
	const user = session?.user;

	return (
		<header className="border-b border-border bg-background sticky top-0 z-10">
			<div className="container mx-auto px-4 h-14 flex items-center justify-between">
				<Link href="/">Rift</Link>
				<nav className="flex items-center gap-6 text-sm">
					<Link href="/champions">Champions</Link>
					<Link href="/tier-list">Tier List</Link>
					<Link href="/player">My Profile</Link>
				</nav>
				<div className="text-sm">
					{user ? (
						<span>
							{user.name} &middot; <a href="/api/auth/signout">Sign out</a>
						</span>
					) : (
						<a href="/api/auth/signin">Sign in</a>
					)}
				</div>
			</div>
		</header>
	);
}
