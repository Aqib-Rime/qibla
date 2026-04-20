import { ORPCError } from "@orpc/server";
import { db } from "@qibla/db";
import { user } from "@qibla/db/schema/auth";
import {
  event,
  imam,
  mosque,
  review,
  savedMosque,
} from "@qibla/db/schema/mosque";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { z } from "zod";
import { authedProcedure, publicProcedure } from "../router-base.ts";

const listInput = z.object({
  page: z.number().int().min(1).optional().default(1),
  pageSize: z.number().int().min(1).max(100).optional().default(20),
  search: z.string().optional(),
});

const byIdInput = z.object({ id: z.string().min(1) });

export const mosquesRouter = {
  list: publicProcedure.input(listInput).handler(async ({ input }) => {
    const { page, pageSize, search } = input;
    const offset = (page - 1) * pageSize;

    const conditions = [
      eq(mosque.status, "approved"),
      search
        ? or(
            ilike(mosque.name, `%${search}%`),
            ilike(mosque.area, `%${search}%`),
            ilike(mosque.address, `%${search}%`),
          )
        : undefined,
    ].filter(Boolean) as ReturnType<typeof eq>[];

    const where = conditions.length === 1 ? conditions[0] : and(...conditions);

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
  }),

  byId: publicProcedure.input(byIdInput).handler(async ({ input, context }) => {
    const [m] = await db
      .select()
      .from(mosque)
      .where(and(eq(mosque.id, input.id), eq(mosque.status, "approved")))
      .limit(1);

    if (!m) {
      throw new ORPCError("NOT_FOUND", { message: "Mosque not found" });
    }

    const userId = context.session?.user?.id;

    const [imamRows, eventRows, reviewRows, savedRows] = await Promise.all([
      db.select().from(imam).where(eq(imam.mosqueId, m.id)).limit(1),
      db
        .select()
        .from(event)
        .where(eq(event.mosqueId, m.id))
        .orderBy(desc(event.createdAt)),
      db
        .select({
          id: review.id,
          rating: review.rating,
          body: review.body,
          createdAt: review.createdAt,
          userName: user.name,
        })
        .from(review)
        .innerJoin(user, eq(review.userId, user.id))
        .where(and(eq(review.mosqueId, m.id), eq(review.status, "approved")))
        .orderBy(desc(review.createdAt))
        .limit(50),
      userId
        ? db
            .select()
            .from(savedMosque)
            .where(
              and(
                eq(savedMosque.userId, userId),
                eq(savedMosque.mosqueId, m.id),
              ),
            )
            .limit(1)
        : Promise.resolve([]),
    ]);

    return {
      mosque: m,
      imam: imamRows[0] ?? null,
      events: eventRows,
      reviews: reviewRows,
      isSaved: savedRows.length > 0,
    };
  }),

  saved: authedProcedure.handler(async ({ context }) => {
    const rows = await db
      .select({
        id: mosque.id,
        name: mosque.name,
        subtitle: mosque.subtitle,
        area: mosque.area,
        address: mosque.address,
        lat: mosque.lat,
        lng: mosque.lng,
        rating: mosque.rating,
        reviewsCount: mosque.reviewsCount,
        open: mosque.open,
        tags: mosque.tags,
        facilities: mosque.facilities,
        photos: mosque.photos,
        savedAt: savedMosque.createdAt,
      })
      .from(savedMosque)
      .innerJoin(mosque, eq(savedMosque.mosqueId, mosque.id))
      .where(eq(savedMosque.userId, context.user.id))
      .orderBy(desc(savedMosque.createdAt));

    return { data: rows };
  }),

  save: authedProcedure
    .input(z.object({ mosqueId: z.string().min(1) }))
    .handler(async ({ input, context }) => {
      await db
        .insert(savedMosque)
        .values({ userId: context.user.id, mosqueId: input.mosqueId })
        .onConflictDoNothing();
      return { ok: true };
    }),

  unsave: authedProcedure
    .input(z.object({ mosqueId: z.string().min(1) }))
    .handler(async ({ input, context }) => {
      await db
        .delete(savedMosque)
        .where(
          and(
            eq(savedMosque.userId, context.user.id),
            eq(savedMosque.mosqueId, input.mosqueId),
          ),
        );
      return { ok: true };
    }),
};
