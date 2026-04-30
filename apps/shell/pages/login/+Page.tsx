import type { JSX } from "react";
import { useCallback, useState } from "react";
import { useData } from "vike-react/useData";

import type { LoginData } from "./+data";

const ERROR_MESSAGES: Record<string, string> = {
	CredentialsSignin: "Invalid username or password.",
	Configuration: "The auth provider is misconfigured. Check the server logs.",
};

function isCsrfPayload(value: unknown): value is { csrfToken: string } {
	return (
		typeof value === "object" && value !== null && typeof (value as { csrfToken?: unknown }).csrfToken === "string"
	);
}

async function submitCredentials(form: HTMLFormElement, callbackUrl: string): Promise<string | null> {
	const csrfRes = await fetch("/api/auth/csrf", { credentials: "include" });
	if (!csrfRes.ok) {
		throw new Error(`csrf HTTP ${csrfRes.status}`);
	}
	const csrfPayload: unknown = await csrfRes.json();
	if (!isCsrfPayload(csrfPayload)) {
		throw new Error("csrf response missing csrfToken");
	}

	// Use URLSearchParams (application/x-www-form-urlencoded) — Auth.js
	// parses both, but urlencoded avoids any multipart-boundary quirks
	// behind dev proxies.
	const body = new URLSearchParams();
	const formData = new FormData(form);
	for (const [k, v] of formData.entries()) {
		if (typeof v === "string") {
			body.set(k, v);
		}
	}
	body.set("csrfToken", csrfPayload.csrfToken);
	body.set("callbackUrl", callbackUrl);

	const res = await fetch("/api/auth/callback/credentials", {
		method: "POST",
		headers: {
			"content-type": "application/x-www-form-urlencoded",
			accept: "application/json",
			// Tells Auth.js to respond with `{ url }` JSON instead of issuing
			// a 302 redirect — so we don't end up following the redirect to
			// the callbackUrl page (which would return HTML and break `.json()`).
			"x-auth-return-redirect": "1",
		},
		body,
		credentials: "include",
		redirect: "follow",
	});

	// Auth.js (with the `x-auth-return-redirect` header) responds with JSON
	// `{ url }` — callbackUrl on success, or `.../login?error=...` on failure.
	if (!res.ok) {
		throw new Error(`callback HTTP ${res.status}`);
	}
	const payload: unknown = await res.json();
	const url = extractUrl(payload);
	if (!url) {
		return "Configuration";
	}
	const finalUrl = new URL(url, globalThis.location?.origin ?? "http://localhost");
	return finalUrl.searchParams.get("error");
}

function extractUrl(payload: unknown): string | null {
	if (!payload || typeof payload !== "object") {
		return null;
	}
	const candidate = (payload as { url?: unknown }).url;
	return typeof candidate === "string" ? candidate : null;
}

/**
 * Custom Auth.js sign-in page. Wired via `authjsConfig.pages.signIn = "/login"`.
 *
 * Form posts to `/api/auth/callback/credentials` with a freshly fetched CSRF
 * token. Auth.js validates `csrfToken` against the `authjs.csrf-token` cookie
 * (set by the GET to `/api/auth/csrf`), so we fetch + post in the same
 * browser context to keep them in sync.
 */
export default function LoginPage(): JSX.Element {
	const { callbackUrl, error: errorCode } = useData<LoginData>();
	const [submitting, setSubmitting] = useState(false);
	const [clientError, setClientError] = useState<string | null>(null);

	const errorMessage =
		clientError ?? (errorCode ? (ERROR_MESSAGES[errorCode] ?? `Sign in failed: ${errorCode}`) : null);

	const handleSubmit = useCallback(
		(event: React.FormEvent<HTMLFormElement>): void => {
			event.preventDefault();
			const form = event.currentTarget;
			setSubmitting(true);
			setClientError(null);
			submitCredentials(form, callbackUrl)
				.then(errorParam => {
					if (errorParam) {
						setClientError(ERROR_MESSAGES[errorParam] ?? `Sign in failed: ${errorParam}`);
						setSubmitting(false);
						return;
					}
					// oxlint-disable-next-line unicorn/prefer-global-this -- browser-only navigation; window.location is the canonical idiom
					window.location.href = callbackUrl;
				})
				.catch((error: unknown) => {
					console.error(error);
					setClientError("Network error. Please try again.");
					setSubmitting(false);
				});
		},
		[callbackUrl],
	);

	return (
		<div className="flex flex-1 items-center justify-center py-12">
			<div className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-sm">
				<div className="mb-6 space-y-1">
					<h1 className="text-2xl font-semibold">Sign in to Rift</h1>
					<p className="text-sm text-muted-foreground">
						Use the demo account <code className="rounded bg-muted px-1 py-0.5 text-xs">rift-demo</code> /{" "}
						<code className="rounded bg-muted px-1 py-0.5 text-xs">demo</code>.
					</p>
				</div>

				{errorMessage ? (
					<div
						role="alert"
						className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
						{errorMessage}
					</div>
				) : null}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-1.5">
						<label htmlFor="username" className="text-sm font-medium">
							Username
						</label>
						<input
							id="username"
							name="username"
							type="text"
							autoComplete="username"
							required
							defaultValue="rift-demo"
							className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
						/>
					</div>
					<div className="space-y-1.5">
						<label htmlFor="password" className="text-sm font-medium">
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							autoComplete="current-password"
							required
							defaultValue="demo"
							className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
						/>
					</div>
					<button
						type="submit"
						disabled={submitting}
						className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60">
						{submitting ? "Signing in…" : "Sign in"}
					</button>
				</form>
			</div>
		</div>
	);
}
