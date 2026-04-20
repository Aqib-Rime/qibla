import { ORPCError } from "@orpc/server";
import { db } from "@qibla/db";
import { mosque, review } from "@qibla/db/schema/mosque";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { authedProcedure } from "../router-base.ts";

function reviewId() {
  return `r_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

const createInput = z.object({
  mosqueId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  body: z.string().max(1000).optional(),
});

export const reviewsRouter = {
  create: authedProcedure
    .input(createInput)
    .handler(async ({ input, context }) => {
      const [m] = await db
        .select({ id: mosque.id })
        .from(mosque)
        .where(eq(mosque.id, input.mosqueId))
        .limit(1);
      if (!m) {
        throw new ORPCError("NOT_FOUND", { message: "Mosque not found" });
      }

      const [row] = await db
        .insert(review)
        .values({
          id: reviewId(),
          mosqueId: input.mosqueId,
          userId: context.user.id,
          rating: input.rating,
          body: input.body,
          status: "pending",
        })
        .returning();

      return row;
    }),

  myForMosque: authedProcedure
    .input(z.object({ mosqueId: z.string().min(1) }))
    .handler(async ({ input, context }) => {
      const rows = await db
        .select()
        .from(review)
        .where(
          and(
            eq(review.mosqueId, input.mosqueId),
            eq(review.userId, context.user.id),
          ),
        )
        .orderBy(desc(review.createdAt));
      return { data: rows };
    }),
};
