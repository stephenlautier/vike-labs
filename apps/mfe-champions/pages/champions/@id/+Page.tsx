import { useData } from "vike-react/useData";
import type { Data } from "./+data";

export default function Page() {
  const champion = useData<Data>();
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{champion.name}</h1>
      <p className="text-muted-foreground">{champion.lore}</p>
    </div>
  );
}
