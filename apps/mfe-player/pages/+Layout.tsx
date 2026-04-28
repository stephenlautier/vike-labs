import "./tailwind.css";
import { usePageContext } from "vike-react/usePageContext";

export default function Layout({ children }: { children: React.ReactNode }) {
	const pageContext = usePageContext();
	// @ts-expect-error session added by authjs middleware
	const session = pageContext.session as { user?: { name?: string } } | null | undefined;
	const user = session?.user;

	return (
		<div className="min-h-screen flex flex-col">
			<header className="border-b border-border bg-background sticky top-0 z-10">
				<div className="container mx-auto px-4 h-14 flex items-center justify-between">
					<a href="/" className="font-bold text-lg tracking-tight">
						My Profile
					</a>
					{user && (
						<span className="text-sm">
							{user.name} &middot; <a href="/api/auth/signout">Sign out</a>
						</span>
					)}
				</div>
			</header>
			<main className="flex-1 container mx-auto px-4 py-8">{children}</main>
		</div>
	);
}
