import type { JSX } from "react";
import { useCallback, useState } from "react";

function isCsrfPayload(value: unknown): value is { csrfToken: string } {
	return (
		typeof value === "object" && value !== null && typeof (value as { csrfToken?: unknown }).csrfToken === "string"
	);
}

/**
 * Sign-out trigger. Auth.js requires a POST to `/api/auth/signout` with a
 * matching `csrfToken` field — a plain `<a href="/api/auth/signout">` only
 * GETs the (now-disabled) confirmation page and never clears the session.
 *
 * Fetches a fresh CSRF token, posts the form, then hard-navigates to `/` so
 * SSR re-runs the auth middleware and the Nav reflects the signed-out state.
 */
export function SignOutButton(): JSX.Element {
	const [pending, setPending] = useState(false);

	const handleClick = useCallback((): void => {
		setPending(true);
		(async () => {
			try {
				const csrfRes = await fetch("/api/auth/csrf", { credentials: "include" });
				if (!csrfRes.ok) {
					throw new Error(`csrf HTTP ${csrfRes.status}`);
				}
				const csrfPayload: unknown = await csrfRes.json();
				if (!isCsrfPayload(csrfPayload)) {
					throw new Error("csrf response missing csrfToken");
				}
				const body = new URLSearchParams();
				body.set("csrfToken", csrfPayload.csrfToken);
				body.set("callbackUrl", "/");
				body.set("json", "true");
				await fetch("/api/auth/signout", {
					method: "POST",
					headers: {
						"content-type": "application/x-www-form-urlencoded",
						accept: "application/json",
					},
					body,
					credentials: "include",
					redirect: "follow",
				});
			} catch (error) {
				console.error("SignOutButton:", error);
			} finally {
				// oxlint-disable-next-line unicorn/prefer-global-this -- browser-only navigation; window.location is the canonical idiom
				window.location.href = "/";
			}
		})().catch(error => {
			console.error(error);
		});
	}, []);

	return (
		<button
			type="button"
			onClick={handleClick}
			disabled={pending}
			className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline disabled:opacity-50">
			{pending ? "Signing out…" : "Sign out"}
		</button>
	);
}
