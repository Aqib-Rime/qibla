import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema/index.ts";

type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

let client: DrizzleDb | undefined;

function getClient(): DrizzleDb {
  if (client) return client;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Put it in .env.local (root) for scripts and .dev.vars (apps/admin) for the Workers runtime.",
    );
  }
  client = drizzle(neon(url), { schema });
  return client;
}

// Lazy Proxy — the Neon client is only created the first time a DB method is accessed.
// Keeps module import side-effect-free so missing env doesn't crash the dev server.
export const db = new Proxy({} as DrizzleDb, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver);
  },
}) as DrizzleDb;

export type Database = DrizzleDb;

export * from "./schema/index.ts";
