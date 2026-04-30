import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

// oxlint-disable-next-line import/no-namespace -- Drizzle convention: namespaced schema barrel passed to drizzle({ schema })
import * as schema from "./schema";

const DB_PATH = process.env.DATABASE_URL ?? "./data/rift.db";

mkdirSync(dirname(DB_PATH), { recursive: true });

const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });
export type DB = typeof db;
export { schema };
