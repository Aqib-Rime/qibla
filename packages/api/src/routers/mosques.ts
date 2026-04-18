import { db } from "@qibla/db"
import { mosque } from "@qibla/db/schema/mosque"
import { and, desc, eq, ilike, or, sql } from "drizzle-orm"
import { z } from "zod"
import { publicProcedure } from "../router-base.ts"

const listInput = z.object({
  page: z.number().int().min(1).optional().default(1),
  pageSize: z.number().int().min(1).max(100).optional().default(20),
  search: z.string().optional(),
})

export const mosquesRouter = {
  list: publicProcedure
    .input(listInput)
    .handler(async ({ input }) => {
      const { page, pageSize, search } = input
      const offset = (page - 1) * pageSize

      const conditions = [
        eq(mosque.status, "approved"),
        search
          ? or(
              ilike(mosque.name, `%${search}%`),
              ilike(mosque.area, `%${search}%`),
              ilike(mosque.address, `%${search}%`)
            )
          : undefined,
      ].filter(Boolean) as ReturnType<typeof eq>[]

      const where = conditions.length === 1 ? conditions[0] : and(...conditions)

      const rows = await db
        .select()
        .from(mosque)
        .where(where)
        .orderBy(desc(mosque.createdAt))
        .limit(pageSize)
        .offset(offset)

      const [totalRow] = await db
        .select({ value: sql<number>`count(*)::int` })
        .from(mosque)
        .where(where)

      return {
        data: rows,
        total: totalRow?.value ?? 0,
        page,
        pageSize,
      }
    }),
}
