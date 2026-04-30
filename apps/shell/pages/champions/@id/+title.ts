import type { PageContext } from "vike/types";

import type { Data } from "@rift/mfe-champions/pages/champion-detail/data";

export default function title(pageContext: PageContext): string {
	const data: Data | undefined = pageContext.data;
	return data?.name ? `${data.name} — Champions · Rift` : "Champion — Rift";
}
