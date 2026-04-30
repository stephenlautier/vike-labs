import type { JSX } from "react";
import { usePageContext } from "vike-react/usePageContext";

type ErrorView = {
	code: string;
	title: string;
	description: string;
	action: { href: string; label: string };
	secondary?: { href: string; label: string };
};

function viewFor(pageContext: ReturnType<typeof usePageContext>): ErrorView {
	const status = pageContext.abortStatusCode;
	const path = pageContext.urlPathname ?? "/";
	if (pageContext.is404 || status === 404) {
		return {
			code: "404",
			title: "Page not found",
			description: "We couldn't find the page you're looking for. It may have been moved or never existed.",
			action: { href: "/", label: "Return home" },
		};
	}
	if (status === 401) {
		const callback = encodeURIComponent(path);
		return {
			code: "401",
			title: "Sign in required",
			description: "This page is only available to signed-in summoners.",
			action: { href: `/login?callbackUrl=${callback}`, label: "Sign in" },
			secondary: { href: "/", label: "Back to home" },
		};
	}
	return {
		code: "500",
		title: "Something went wrong",
		description: "An unexpected error occurred. Please try again in a moment.",
		action: { href: "/", label: "Return home" },
	};
}

export default function Page(): JSX.Element {
	const pageContext = usePageContext();
	const view = viewFor(pageContext);

	return (
		<div className="flex min-h-[60vh] items-center justify-center">
			<div className="w-full max-w-md rounded-lg border border-border bg-card p-8 text-center shadow-sm">
				<p className="text-6xl font-bold tracking-tight text-muted-foreground">{view.code}</p>
				<h1 className="mt-4 text-2xl font-semibold">{view.title}</h1>
				<p className="mt-2 text-sm text-muted-foreground">{view.description}</p>
				<div className="mt-6 flex flex-wrap items-center justify-center gap-3">
					<a
						href={view.action.href}
						className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
						{view.action.label}
					</a>
					{view.secondary ? (
						<a
							href={view.secondary.href}
							className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
							{view.secondary.label}
						</a>
					) : null}
				</div>
			</div>
		</div>
	);
}
