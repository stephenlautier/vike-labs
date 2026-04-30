import { render } from "vike/abort";
import type { PageContextServer } from "vike/types";

export async function guard(pageContext: PageContextServer) {
	const session = pageContext.session;
	if (!session?.user) {
		throw render(401);
	}
}
