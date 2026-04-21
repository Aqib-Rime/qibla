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
import { and, asc, desc, eq, gte, ilike, lte, or, sql } from "drizzle-orm";
import { z } from "zod";
import { authedProcedure, publicProcedure } from "../router-base.ts";

function mosqueId() {
  return `m_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

const submitInput = z.object({
  name: z.string().min(1, "Name is required").max(200),
  subtitle: z.string().max(200).nullish(),
  about: z.string().max(2000).nullish(),
  address: z.string().max(300).nullish(),
  street: z.string().max(200).nullish(),
  area: z.string().max(100).nullish(),
  city: z.string().min(1).max(100).default("Dhaka"),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  open: z.boolean().default(true),
  tags: z.array(z.string().min(1).max(50)).max(20).default([]),
  facilities: z.array(z.string().min(1).max(50)).max(20).default([]),
  photos: z.array(z.string().url().max(500)).max(12).default([]),
});

const updateMineInput = submitInput.extend({
  id: z.string().min(1),
});

const listInput = z.object({
  page: z.number().int().min(1).optional().default(1),
  pageSize: z.number().int().min(1).max(100).optional().default(20),
  search: z.string().optional(),
});

const byIdInput = z.object({ id: z.string().min(1) });

const nearbyInput = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  radiusKm: z.number().positive().max(500).default(5),
  limit: z.number().int().min(1).max(200).optional().default(100),
});

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

  nearby: publicProcedure.input(nearbyInput).handler(async ({ input }) => {
    const { lat, lng, radiusKm, limit } = input;

    // Bounding box pre-filter — indexable, roughly right, trimmed by exact haversine below.
    // 1 deg latitude ≈ 111.32 km. Longitude scales with cos(lat) to stay roughly square at any latitude.
    const latDelta = radiusKm / 111.32;
    const lngDelta = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180));

    const minLat = lat - latDelta;
    const maxLat = lat + latDelta;
    const minLng = lng - lngDelta;
    const maxLng = lng + lngDelta;

    // Haversine distance in km: 2 * R * asin(sqrt(sin²(Δφ/2) + cos(φ1)·cos(φ2)·sin²(Δλ/2))), R = 6371.
    const distanceKm = sql<number>`
      2 * 6371 * asin(sqrt(
        sin(radians(${mosque.lat} - ${lat}) / 2) * sin(radians(${mosque.lat} - ${lat}) / 2)
        + cos(radians(${lat})) * cos(radians(${mosque.lat}))
          * sin(radians(${mosque.lng} - ${lng}) / 2) * sin(radians(${mosque.lng} - ${lng}) / 2)
      ))
    `;

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
        distanceKm,
      })
      .from(mosque)
      .where(
        and(
          eq(mosque.status, "approved"),
          gte(mosque.lat, minLat),
          lte(mosque.lat, maxLat),
          gte(mosque.lng, minLng),
          lte(mosque.lng, maxLng),
          sql`${distanceKm} <= ${radiusKm}`,
        ),
      )
      .orderBy(asc(distanceKm))
      .limit(limit);

    return { data: rows, radiusKm, center: { lat, lng } };
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

  // User-submitted mosque. Lands as status=pending; admin approves via the
  // existing mosques moderation flow. The createdBy column scopes later
  // edit/delete access back to the original submitter.
  submit: authedProcedure
    .input(submitInput)
    .handler(async ({ input, context }) => {
      const [row] = await db
        .insert(mosque)
        .values({
          id: mosqueId(),
          ...input,
          status: "pending",
          createdBy: context.user.id,
        })
        .returning();
      return row;
    }),

  // User's own submissions — any status. Paginated.
  mine: authedProcedure
    .input(
      z
        .object({
          page: z.number().int().min(1).optional().default(1),
          pageSize: z.number().int().min(1).max(100).optional().default(50),
        })
        .optional()
        .default({}),
    )
    .handler(async ({ input, context }) => {
      const page = input?.page ?? 1;
      const pageSize = input?.pageSize ?? 50;
      const offset = (page - 1) * pageSize;

      const rows = await db
        .select()
        .from(mosque)
        .where(eq(mosque.createdBy, context.user.id))
        .orderBy(desc(mosque.createdAt))
        .limit(pageSize)
        .offset(offset);

      const [totalRow] = await db
        .select({ value: sql<number>`count(*)::int` })
        .from(mosque)
        .where(eq(mosque.createdBy, context.user.id));

      return {
        data: rows,
        total: totalRow?.value ?? 0,
        page,
        pageSize,
      };
    }),

  // Edit a submission the user owns. Only allowed while the row is still
  // pending — once an admin approves it, the admin-only update path takes over.
  updateMine: authedProcedure
    .input(updateMineInput)
    .handler(async ({ input, context }) => {
      const { id, ...fields } = input;

      const [existing] = await db
        .select({ createdBy: mosque.createdBy, status: mosque.status })
        .from(mosque)
        .where(eq(mosque.id, id))
        .limit(1);

      if (!existing) {
        throw new ORPCError("NOT_FOUND", { message: "Mosque not found" });
      }
      if (existing.createdBy !== context.user.id) {
        throw new ORPCError("FORBIDDEN", {
          message: "You can only edit your own submissions",
        });
      }
      if (existing.status !== "pending") {
        throw new ORPCError("FORBIDDEN", {
          message: "Approved mosques can only be edited by an admin",
        });
      }

      const [row] = await db
        .update(mosque)
        .set({ ...fields, updatedAt: new Date() })
        .where(eq(mosque.id, id))
        .returning();

      return row;
    }),

  // Withdraw your own pending submission.
  deleteMine: authedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .handler(async ({ input, context }) => {
      const [existing] = await db
        .select({ createdBy: mosque.createdBy, status: mosque.status })
        .from(mosque)
        .where(eq(mosque.id, input.id))
        .limit(1);

      if (!existing) {
        throw new ORPCError("NOT_FOUND", { message: "Mosque not found" });
      }
      if (existing.createdBy !== context.user.id) {
        throw new ORPCError("FORBIDDEN", {
          message: "You can only withdraw your own submissions",
        });
      }
      if (existing.status !== "pending") {
        throw new ORPCError("FORBIDDEN", {
          message: "Approved mosques can only be removed by an admin",
        });
      }

      await db.delete(mosque).where(eq(mosque.id, input.id));
      return { ok: true };
    }),
};
