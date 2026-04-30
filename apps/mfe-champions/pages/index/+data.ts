import type { Champion } from "@rift/champion";
import { SEED_CHAMPIONS } from "@rift/champion";

export type Data = {
	champions: Champion[];
};

export async function data(): Promise<Data> {
	return { champions: SEED_CHAMPIONS };
}
