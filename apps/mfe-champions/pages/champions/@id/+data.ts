import type { Champion, ChampionAbility, ChampionSkin } from "@rift/champion";
import { SEED_ABILITIES, SEED_CHAMPIONS, SEED_SKINS } from "@rift/champion";
import { render } from "vike/abort";
import type { PageContextServer } from "vike/types";

export type Data = Champion & {
	abilities: ChampionAbility[];
	skins: ChampionSkin[];
};

export async function data(pageContext: PageContextServer): Promise<Data> {
	const { id } = pageContext.routeParams;
	const champion = SEED_CHAMPIONS.find(c => c.id === id);
	if (!champion) {
		throw render(404);
	}
	const abilities = SEED_ABILITIES.filter(a => a.championId === id);
	const skins = SEED_SKINS.filter(s => s.championId === id);
	return { ...champion, abilities, skins };
}
