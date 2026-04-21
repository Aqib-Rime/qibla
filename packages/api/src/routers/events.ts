import { ORPCError } from "@orpc/server";
import { db } from "@qibla/db";
import { event, mosque } from "@qibla/db/schema/mosque";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { z } from "zod";
import { adminProcedure, publicProcedure } from "../router-base.ts";

function eventId() {
  return `e_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

const listInput = z.object({
  mosqueId: z.string().min(1).optional(),
  page: z.number().int().min(1).optional().default(1),
  pageSize: z.number().int().min(1).max(100).optional().default(20),
  search: z.string().optional(),
});

const createInput = z.object({
  mosqueId: z.string().min(1),
  title: z.string().min(1).max(200),
  when: z.string().min(1).max(200),
  by: z.string().max(200).nullish(),
  description: z.string().max(2000).nullish(),
});

const updateInput = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  when: z.string().min(1).max(200),
  by: z.string().max(200).nullish(),
  description: z.string().max(2000).nullish(),
});

export const eventsRouter = {
  list: publicProcedure.input(listInput).handler(async ({ input }) => {
    const { mosqueId, page, pageSize, search } = input;
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
    ].filter(Boolean) as ReturnType<typeof eq>[];

    const where =
      conditions.length === 0
        ? undefined
        : conditions.length === 1
          ? conditions[0]
          : and(...conditions);

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
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .handler(async ({ input }) => {
      const [row] = await db
        .select()
        .from(event)
        .where(eq(event.id, input.id))
        .limit(1);
      if (!row) {
        throw new ORPCError("NOT_FOUND", { message: "Event not found" });
      }
      return row;
    }),

  create: adminProcedure.input(createInput).handler(async ({ input }) => {
    const [m] = await db
      .select({ id: mosque.id })
      .from(mosque)
      .where(eq(mosque.id, input.mosqueId))
      .limit(1);
    if (!m) {
      throw new ORPCError("NOT_FOUND", { message: "Mosque not found" });
    }

    const [row] = await db
      .insert(event)
      .values({
        id: eventId(),
        mosqueId: input.mosqueId,
        title: input.title,
        when: input.when,
        by: input.by ?? null,
        description: input.description ?? null,
      })
      .returning();

    return row;
  }),

  update: adminProcedure.input(updateInput).handler(async ({ input }) => {
    const [row] = await db
      .update(event)
      .set({
        title: input.title,
        when: input.when,
        by: input.by ?? null,
        description: input.description ?? null,
      })
      .where(eq(event.id, input.id))
      .returning();

    if (!row) {
      throw new ORPCError("NOT_FOUND", { message: "Event not found" });
    }

    return row;
  }),

  delete: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .handler(async ({ input }) => {
      const deleted = await db
        .delete(event)
        .where(eq(event.id, input.id))
        .returning({ id: event.id });

      if (deleted.length === 0) {
        throw new ORPCError("NOT_FOUND", { message: "Event not found" });
      }

      return { ok: true };
    }),
};
