import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/lib/env";

import * as schema from "./schema";

const globalForDatabase = globalThis as unknown as {
  sqlClient: ReturnType<typeof postgres> | undefined;
};

const sqlClient =
  globalForDatabase.sqlClient ??
  postgres(env.DATABASE_URL, {
    max: 5,
    prepare: false,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.sqlClient = sqlClient;
}

export const db = drizzle(sqlClient, { schema });

export async function closeDatabaseConnection() {
  await sqlClient.end();
}
