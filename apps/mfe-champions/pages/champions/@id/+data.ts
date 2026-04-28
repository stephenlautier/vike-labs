import type { PageContextServer } from "vike/types";

export type Data = {
  id: string;
  name: string;
  lore: string;
};

export async function data(pageContext: PageContextServer): Promise<Data> {
  const { id } = pageContext.routeParams;
  // TODO: fetch from data-access
  return { id, name: id, lore: "Champion lore placeholder." };
}
