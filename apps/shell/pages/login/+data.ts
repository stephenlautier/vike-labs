import type { PageContextServer } from "vike/types";

export type LoginData = {
	callbackUrl: string;
	error: string | null;
};

/**
 * Server-side loader for the custom `/login` page. Reads the optional
 * `callbackUrl` (so successful logins return where the user came from) and
 * forwards the Auth.js `error` query param (Auth.js redirects back here
 * with `?error=CredentialsSignin` on a bad password).
 *
 * The CSRF token is fetched client-side just before the form post so we
 * don't need to plumb `Set-Cookie` headers through Vike's data hook.
 */
export function data(pageContext: PageContextServer): LoginData {
	const search = pageContext.urlParsed.search;
	return {
		callbackUrl: search.callbackUrl ?? "/",
		error: search.error ?? null,
	};
}
