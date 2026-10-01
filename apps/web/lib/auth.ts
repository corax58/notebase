import { db } from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import * as schema from "@/db/schema";

const trustedOrigins =
  process.env.ENVIROMENT == "DEV"
    ? ["chrome-extension://*"]
    : (process.env.EXTENSION_ID as string) != null
      ? [`chrome-extension://${process.env.EXTENSION_ID}`]
      : [];

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins,
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite",
    schema,
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
