import "./tailwind.css";
import { usePageContext } from "vike-react/usePageContext";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen flex flex-col">
			<Nav />
			<main className="flex-1 container mx-auto px-4 py-8">{children}</main>
		</div>
	);
}

function Nav() {
	const pageContext = usePageContext();
	const session = pageContext.session as { user?: { name?: string } } | null | undefined;
	const user = session?.user;

	return (
		<header className="border-b border-border bg-background sticky top-0 z-10">
			<div className="container mx-auto px-4 h-14 flex items-center justify-between">
				<a href="/" className="font-bold text-lg tracking-tight">
					Rift
				</a>
				<nav className="flex items-center gap-6 text-sm">
					<a href="http://localhost:3001">Champions</a>
					<a href="http://localhost:3002">Tier List</a>
					<a href="http://localhost:3003">My Profile</a>
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
