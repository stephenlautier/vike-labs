import "./tailwind.css";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen flex flex-col">
			<header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
				<div className="container mx-auto px-4 h-14 flex items-center gap-6">
					<a href="/" className="font-bold text-lg tracking-tight hover:text-primary transition-colors">
						⚔️ Champions
					</a>
				</div>
			</header>
			<main className="flex-1 container mx-auto px-4 py-8">{children}</main>
		</div>
	);
}
