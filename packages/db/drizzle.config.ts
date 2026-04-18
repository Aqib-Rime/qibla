import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ["../../.env.local", "../../.env", ".env.local", ".env"] });

export default defineConfig({
  out: "./migrations",
  schema: "./src/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
