import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";

export const authMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const request = getRequest();
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      throw new Response("Unauthorized", { status: 401 });
    }

    return next({
      context: {
        session,
        user: session.user,
      },
    });
  },
);

export const adminMiddleware = createMiddleware({ type: "function" })
  .middleware([authMiddleware])
  .server(async ({ next, context }) => {
    if (context.user.role !== "admin") {
      throw new Response("Forbidden", { status: 403 });
    }
    return next({ context });
  });
