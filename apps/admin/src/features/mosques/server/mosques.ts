import { db } from "@qibla/db";
import { mosque } from "@qibla/db/schema/mosque";
import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { z } from "zod";
import { adminMiddleware } from "@/middleware/auth-middleware";
import {
  createMosqueSchema,
  listMosquesSchema,
  updateMosqueSchema,
} from "../lib/schemas";

function cuid() {
  return `m_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

export const listMosquesFn = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .inputValidator(listMosquesSchema)
  .handler(async ({ data }) => {
    const { page, pageSize, search, status } = data;
    const offset = (page - 1) * pageSize;

    const conditions = [
      search
        ? or(
            ilike(mosque.name, `%${search}%`),
            ilike(mosque.area, `%${search}%`),
            ilike(mosque.address, `%${search}%`),
          )
        : undefined,
      status ? eq(mosque.status, status) : undefined,
    ].filter(Boolean);

    const where = conditions.length ? and(...conditions) : undefined;

    const rows = await db
      .select()
      .from(mosque)
      .where(where)
      .orderBy(desc(mosque.createdAt))
      .limit(pageSize)
      .offset(offset);

    const [totalRow] = await db
      .select({ value: sql<number>`count(*)::int` })
      .from(mosque)
      .where(where);

    return {
      data: rows,
      total: totalRow?.value ?? 0,
      page,
      pageSize,
    };
  });

export const getMosqueFn = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const [row] = await db.select().from(mosque).where(eq(mosque.id, data.id));
    if (!row) throw new Error("Mosque not found");
    return row;
  });

export const createMosqueFn = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .inputValidator(createMosqueSchema)
  .handler(async ({ data, context }) => {
    const [row] = await db
      .insert(mosque)
      .values({
        id: cuid(),
        ...data,
        createdBy: context.user.id,
      })
      .returning();
    return row;
  });

export const updateMosqueFn = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .inputValidator(updateMosqueSchema)
  .handler(async ({ data }) => {
    const { id, ...updates } = data;
    const [row] = await db
      .update(mosque)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(mosque.id, id))
      .returning();
    return row;
  });

export const deleteMosqueFn = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await db.delete(mosque).where(eq(mosque.id, data.id));
    return { ok: true };
  });
