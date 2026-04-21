import { db } from "@qibla/db";
import { event, mosque } from "@qibla/db/schema/mosque";
import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { z } from "zod";
import { adminMiddleware } from "@/middleware/auth-middleware";
import {
  createEventSchema,
  listEventsSchema,
  updateEventSchema,
} from "../lib/schemas";

function eventId() {
  return `e_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

export const listEventsFn = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .inputValidator(listEventsSchema)
  .handler(async ({ data }) => {
    const { page, pageSize, search, mosqueId } = data;
    const offset = (page - 1) * pageSize;

    const conditions = [
      mosqueId ? eq(event.mosqueId, mosqueId) : undefined,
      search
        ? or(
            ilike(event.title, `%${search}%`),
            ilike(event.when, `%${search}%`),
            ilike(event.by, `%${search}%`),
          )
        : undefined,
    ].filter(Boolean);

    const where = conditions.length ? and(...conditions) : undefined;

    const rows = await db
      .select({
        id: event.id,
        mosqueId: event.mosqueId,
        mosqueName: mosque.name,
        title: event.title,
        when: event.when,
        by: event.by,
        description: event.description,
        createdAt: event.createdAt,
      })
      .from(event)
      .innerJoin(mosque, eq(event.mosqueId, mosque.id))
      .where(where)
      .orderBy(desc(event.createdAt))
      .limit(pageSize)
      .offset(offset);

    const [totalRow] = await db
      .select({ value: sql<number>`count(*)::int` })
      .from(event)
      .where(where);

    return {
      data: rows,
      total: totalRow?.value ?? 0,
      page,
      pageSize,
    };
  });

export const getEventFn = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const [row] = await db.select().from(event).where(eq(event.id, data.id));
    if (!row) throw new Error("Event not found");
    return row;
  });

export const createEventFn = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .inputValidator(createEventSchema)
  .handler(async ({ data }) => {
    const [m] = await db
      .select({ id: mosque.id })
      .from(mosque)
      .where(eq(mosque.id, data.mosqueId))
      .limit(1);
    if (!m) throw new Error("Mosque not found");

    const [row] = await db
      .insert(event)
      .values({
        id: eventId(),
        mosqueId: data.mosqueId,
        title: data.title,
        when: data.when,
        by: data.by ?? null,
        description: data.description ?? null,
      })
      .returning();
    return row;
  });

export const updateEventFn = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .inputValidator(updateEventSchema)
  .handler(async ({ data }) => {
    const { id, ...updates } = data;
    const [row] = await db
      .update(event)
      .set({
        mosqueId: updates.mosqueId,
        title: updates.title,
        when: updates.when,
        by: updates.by ?? null,
        description: updates.description ?? null,
      })
      .where(eq(event.id, id))
      .returning();
    if (!row) throw new Error("Event not found");
    return row;
  });

export const deleteEventFn = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await db.delete(event).where(eq(event.id, data.id));
    return { ok: true };
  });
