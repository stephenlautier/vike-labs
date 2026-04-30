import type { EnrichedTierEntry } from "../../server/tier-list-handler";
import { buildEnrichedTiers } from "../../server/tier-list-handler";

export type Data = {
	entries: EnrichedTierEntry[];
	patches: string[];
};

export async function data(): Promise<Data> {
	const entries = buildEnrichedTiers();
	const patches = [...new Set(entries.map(e => e.patch))].toSorted().toReversed();
	return { entries, patches };
}
