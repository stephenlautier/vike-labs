import { render } from "vike/abort";
import type { PageContext } from "vike/types";

/**
 * Guard player routes — only signed-in users may view their profile, owned
 * champions, or match history. Anonymous requests get the redesigned 401
 * page (which links to `/login?callbackUrl=/player/...`).
 */
export function guard(pageContext: PageContext): void {
	if (!pageContext.session?.user) {
		throw render(401);
	}
}
