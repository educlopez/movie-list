import { defineConfig } from "drizzle-kit";

const authToken = process.env.TURSO_AUTH_TOKEN;
const url = process.env.TURSO_DATABASE_URL;

if (!(authToken && url)) {
  throw new Error("TURSO_AUTH_TOKEN and TURSO_DATABASE_URL must be set");
}

export default defineConfig({
  dbCredentials: {
    authToken,
    url,
  },
  dialect: "turso",
  out: "./drizzle",
  schema: "./src/db/schema.ts",
});
