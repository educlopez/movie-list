import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// Lazy initialization to avoid build-time errors when env vars aren't available
let _db: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!_db) {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
    _db = drizzle(client, { schema });
  }
  return _db;
}

// Proxy that lazily initializes DB on first access
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    const instance = getDb();
    const value = (instance as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});
