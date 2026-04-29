import { render } from "vike/abort";
import type { PageContextServer } from "vike/types";

export async function guard(pageContext: PageContextServer) {
	// @ts-expect-error session added by authjs middleware
	const session = pageContext.session as { user?: unknown } | null | undefined;
	if (!session?.user) throw render(401);
}
