import type { Data } from "@rift/mfe-champions/pages/champion-detail/data";
import type { PageContext } from "vike/types";

export default function title(pageContext: PageContext): string {
	const data: Data | undefined = pageContext.data;
	return data?.name ? `${data.name} — Champions · Rift` : "Champion — Rift";
}
