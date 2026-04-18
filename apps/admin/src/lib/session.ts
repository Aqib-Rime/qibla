import { db } from "@qibla/db";
import { user } from "@qibla/db/schema/auth";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { count } from "drizzle-orm";
import { auth } from "@/lib/auth";

export const getSessionFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getRequest();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return null;
    return session;
  },
);

export const getUserCountFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const [row] = await db.select({ value: count() }).from(user);
    return row?.value ?? 0;
  },
);
