import { db } from "@qibla/db";
import { user } from "@qibla/db/schema/auth";
import { mosque, review } from "@qibla/db/schema/mosque";
import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, sql } from "drizzle-orm";
import { adminMiddleware } from "@/middleware/auth-middleware";
import { listReviewsSchema, setReviewStatusSchema } from "../lib/schemas";

async function recomputeMosqueRating(mosqueId: string) {
  const [stats] = await db
    .select({
      avg: sql<number>`coalesce(avg(${review.rating})::real, 0)`,
      count: sql<number>`count(*)::int`,
    })
    .from(review)
    .where(and(eq(review.mosqueId, mosqueId), eq(review.status, "approved")));

  await db
    .update(mosque)
    .set({
      rating: stats?.count ? stats.avg : null,
      reviewsCount: stats?.count ?? 0,
      updatedAt: new Date(),
    })
    .where(eq(mosque.id, mosqueId));
}

export const listReviewsFn = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .inputValidator(listReviewsSchema)
  .handler(async ({ data }) => {
    const { page, pageSize, status } = data;
    const offset = (page - 1) * pageSize;

    const where = status ? eq(review.status, status) : undefined;

    const rows = await db
      .select({
        id: review.id,
        rating: review.rating,
        body: review.body,
        status: review.status,
        createdAt: review.createdAt,
        mosqueId: review.mosqueId,
        mosqueName: mosque.name,
        userId: review.userId,
        userName: user.name,
        userEmail: user.email,
      })
      .from(review)
      .innerJoin(mosque, eq(review.mosqueId, mosque.id))
      .innerJoin(user, eq(review.userId, user.id))
      .where(where)
      .orderBy(desc(review.createdAt))
      .limit(pageSize)
      .offset(offset);

    const [totalRow] = await db
      .select({ value: sql<number>`count(*)::int` })
      .from(review)
      .where(where);

    return {
      data: rows,
      total: totalRow?.value ?? 0,
      page,
      pageSize,
    };
  });

export const setReviewStatusFn = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .inputValidator(setReviewStatusSchema)
  .handler(async ({ data }) => {
    const [row] = await db
      .update(review)
      .set({ status: data.status })
      .where(eq(review.id, data.id))
      .returning();

    if (!row) throw new Error("Review not found");

    await recomputeMosqueRating(row.mosqueId);

    return row;
  });

export const reviewCountsFn = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .handler(async () => {
    const rows = await db
      .select({
        status: review.status,
        count: sql<number>`count(*)::int`,
      })
      .from(review)
      .groupBy(review.status);

    const counts: Record<"pending" | "approved" | "hidden", number> = {
      pending: 0,
      approved: 0,
      hidden: 0,
    };
    for (const r of rows) {
      counts[r.status] = r.count;
    }
    return counts;
  });
