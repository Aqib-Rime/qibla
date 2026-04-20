import { expo } from "@better-auth/expo";
import { db } from "@qibla/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";

const trustedOriginsEnv: string = process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "";
const extraTrustedOrigins = trustedOriginsEnv
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  // Native clients don't send an Origin header by default.
  // Declare the app scheme + any LAN/dev origins so Better Auth accepts them.
  trustedOrigins: ["qibla://", "qibla://*", ...extraTrustedOrigins],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    async sendResetPassword({ user, url }) {
      console.log("Reset password for:", user.email, "URL:", url);
    },
  },
  session: {
    expiresIn: 15 * 24 * 60 * 60,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  plugins: [
    expo(),
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
  ],
});

export type Auth = typeof auth;
export type Session = Awaited<ReturnType<Auth["api"]["getSession"]>>;
