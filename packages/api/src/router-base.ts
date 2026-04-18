import { ORPCError, os } from "@orpc/server"
import type { AppContext } from "./context.ts"

export const base = os.$context<AppContext>()

export const publicProcedure = base

export const authedProcedure = base.use(({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED", { message: "Sign in to continue" })
  }
  return next({
    context: {
      ...context,
      user: context.session.user,
    },
  })
})

export const adminProcedure = authedProcedure.use(({ context, next }) => {
  if (context.user.role !== "admin") {
    throw new ORPCError("FORBIDDEN", { message: "Admins only" })
  }
  return next({ context })
})
