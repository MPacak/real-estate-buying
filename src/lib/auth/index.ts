import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";

import { db } from "@/db";
import {
  accounts,
  sessions,
  users,
  verifications,
} from "@/db/schema/auth";
import { env } from "@/lib/env";

type CreateAuthOptions = {
  allowSignUp?: boolean;
};

export function createAuth({ allowSignUp = false }: CreateAuthOptions = {}) {
  return betterAuth({
    appName: "House Buying Tracker",
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: [env.BETTER_AUTH_URL],
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        user: users,
        session: sessions,
        account: accounts,
        verification: verifications,
      },
    }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: !allowSignUp,
      minPasswordLength: 8,
    },
  });
}

export const auth = createAuth();
