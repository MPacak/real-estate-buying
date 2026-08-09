import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { z } from "zod";

config({ path: ".env.local" });
config();

const migrationEnvironment = z
  .object({
    DATABASE_URL_DIRECT: z.string().min(1),
  })
  .parse(process.env);

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    url: migrationEnvironment.DATABASE_URL_DIRECT,
  },
  strict: true,
  verbose: true,
});
